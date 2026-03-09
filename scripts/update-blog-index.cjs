#!/usr/bin/env node
/**
 * Update Ranking blog index with new article
 */

const fs = require('fs');
const path = require('path');

const BLOG_INDEX = path.resolve(__dirname, '../public/blog/index.html');
const SCHEDULED_DIR = path.resolve(__dirname, '../scheduled');

function readScheduledArticle(date) {
  const filePath = path.join(SCHEDULED_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function generateArticleCard(article) {
  const colorMap = {
    'Wiedza': { bg: 'blue-100', text: 'blue-700' },
    'Rodzina': { bg: 'red-100', text: 'red-700' },
    'Terapia': { bg: 'green-100', text: 'green-700' },
    'Medycyna': { bg: 'purple-100', text: 'purple-700' },
    'Pierwszy krok': { bg: 'amber-100', text: 'amber-700' },
    'Przygotowanie': { bg: 'indigo-100', text: 'indigo-700' },
  };
  const colors = colorMap[article.category] || { bg: 'blue-100', text: 'blue-700' };

  return `
            <!-- Article: ${article.title} -->
            <article class="article-card bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl">
                <a href="/blog/${article.slug}/" class="block">
                    <div class="h-48 relative overflow-hidden">
                        <img src="${article.image}" alt="${article.imageAlt}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="bg-${colors.bg} dark:bg-${colors.bg.replace('100', '900/30')} text-${colors.text} dark:text-${colors.text.replace('700', '300')} px-2 py-1 rounded text-xs font-medium">${article.category}</span>
                            <time datetime="${article.date}" class="text-slate-500 text-sm">${article.dateFormatted.split(' ').slice(0, 2).join(' ').replace('lutego', 'lut').replace('stycznia', 'sty').replace('marca', 'mar')}</time>
                        </div>
                        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">${article.title}</h2>
                        <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">${article.excerpt}</p>
                    </div>
                </a>
            </article>`;
}

function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: node update-blog-index.js YYYY-MM-DD');
    process.exit(1);
  }

  const article = readScheduledArticle(date);
  if (!article) {
    console.log('No article found for', date);
    process.exit(0);
  }

  let indexHtml = fs.readFileSync(BLOG_INDEX, 'utf-8');

  // Check for duplicate
  if (indexHtml.includes(`/blog/${article.slug}/`)) {
    console.log('[Ranking] Article already in index, skipping:', article.slug);
    return;
  }

  // Find the articles grid and insert new article at the top
  const gridStart = indexHtml.indexOf('<div class="articles-grid');
  const firstArticle = indexHtml.indexOf('<article', gridStart);

  if (firstArticle === -1) {
    console.error('Could not find articles grid');
    process.exit(1);
  }

  const newCard = generateArticleCard(article);
  indexHtml = indexHtml.slice(0, firstArticle) + newCard + '\n' + indexHtml.slice(firstArticle);

  fs.writeFileSync(BLOG_INDEX, indexHtml);
  console.log('[Ranking] Updated blog index with:', article.title);
}

main();
