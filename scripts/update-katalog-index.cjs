#!/usr/bin/env node
/**
 * Update Katalog blog index with new article
 */

const fs = require('fs');
const path = require('path');

const IS_CI = process.env.GITHUB_ACTIONS === 'true';
const BLOG_INDEX = path.resolve(__dirname, IS_CI ? '../../katalog/blog/index.html' : '../../katalog-o-rodk-w/blog/index.html');
const SCHEDULED_DIR = path.resolve(__dirname, '../scheduled');

function readScheduledArticle(date) {
  const filePath = path.join(SCHEDULED_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function generateArticleCard(article) {
  return `
            <!-- Article: ${article.title} -->
            <article class="article-card">
                <a href="/blog/${article.slug}/">
                    <div class="card-image" style="background: #13151a;">
                        <img src="${article.image}" alt="${article.imageAlt}" style="width:100%;height:100%;object-fit:cover;opacity:0.85;">
                        <span class="card-category">${article.category}</span>
                    </div>
                    <div class="card-content">
                        <time class="card-date">${article.dateFormatted}</time>
                        <h2 class="card-title">${article.title}</h2>
                        <p class="card-excerpt">${article.excerpt}</p>
                        <span class="card-link">Czytaj więcej →</span>
                    </div>
                </a>
            </article>`;
}

function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: node update-katalog-index.js YYYY-MM-DD');
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
    console.log('[Katalog] Article already in index, skipping:', article.slug);
    return;
  }

  // Find the articles grid and insert new article at the top
  const gridStart = indexHtml.indexOf('<div class="articles-grid">');
  const firstArticle = indexHtml.indexOf('<article', gridStart);

  if (firstArticle === -1) {
    console.error('Could not find articles grid');
    process.exit(1);
  }

  const newCard = generateArticleCard(article);
  indexHtml = indexHtml.slice(0, firstArticle) + newCard + '\n' + indexHtml.slice(firstArticle);

  fs.writeFileSync(BLOG_INDEX, indexHtml);
  console.log('[Katalog] Updated blog index with:', article.title);
}

main();
