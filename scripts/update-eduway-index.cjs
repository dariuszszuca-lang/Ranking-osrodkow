#!/usr/bin/env node
/**
 * Update EduWay blog index with new article
 */

const fs = require('fs');
const path = require('path');

const IS_CI = process.env.GITHUB_ACTIONS === 'true';
const BLOG_INDEX = path.resolve(__dirname, IS_CI ? '../../eduway/blog.html' : '../../eduway-platformaedukacyjna/blog.html');
const SCHEDULED_DIR = path.resolve(__dirname, '../scheduled');

function readScheduledArticle(date) {
  const filePath = path.join(SCHEDULED_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function generateArticleCard(article) {
  return `
                <!-- Article: ${article.title} -->
                <article class="group">
                    <a href="/blog/${article.slug}.html" class="block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                        <div class="h-48 relative overflow-hidden">
                            <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="p-6">
                            <div class="flex items-center gap-3 mb-3">
                                <span class="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">${article.category}</span>
                                <time class="text-gray-500 text-sm">${article.dateFormatted}</time>
                            </div>
                            <h2 class="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">${article.title}</h2>
                            <p class="text-gray-400 text-sm line-clamp-2">${article.excerpt}</p>
                        </div>
                    </a>
                </article>`;
}

function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: node update-eduway-index.js YYYY-MM-DD');
    process.exit(1);
  }

  const article = readScheduledArticle(date);
  if (!article) {
    console.log('No article found for', date);
    process.exit(0);
  }

  let indexHtml = fs.readFileSync(BLOG_INDEX, 'utf-8');

  // Check for duplicate
  if (indexHtml.includes(`/blog/${article.slug}`)) {
    console.log('[EduWay] Article already in index, skipping:', article.slug);
    return;
  }

  // Find the articles grid and insert new article at the top
  const gridPattern = /class="grid[^"]*grid-cols/;
  const gridMatch = indexHtml.match(gridPattern);

  if (!gridMatch) {
    console.error('Could not find articles grid');
    process.exit(1);
  }

  const gridStart = indexHtml.indexOf(gridMatch[0]);
  const gridTagEnd = indexHtml.indexOf('>', gridStart) + 1;
  const firstArticle = indexHtml.indexOf('<article', gridTagEnd);

  if (firstArticle === -1) {
    // No existing articles, insert after grid opening tag
    const newCard = generateArticleCard(article);
    indexHtml = indexHtml.slice(0, gridTagEnd) + '\n' + newCard + indexHtml.slice(gridTagEnd);
  } else {
    const newCard = generateArticleCard(article);
    indexHtml = indexHtml.slice(0, firstArticle) + newCard + '\n' + indexHtml.slice(firstArticle);
  }

  fs.writeFileSync(BLOG_INDEX, indexHtml);
  console.log('[EduWay] Updated blog index with:', article.title);
}

main();
