#!/usr/bin/env node
/**
 * Update osrodek-myway Blog.tsx and MyTherapy.tsx with new article entry
 * Adds article to both feed pages so it appears in listing
 */

const fs = require('fs');
const path = require('path');

const IS_CI = process.env.GITHUB_ACTIONS === 'true';
const BLOG_TSX = path.resolve(__dirname, IS_CI ? '../../osrodek/src/pages/Blog.tsx' : '../../myway-revived-vision/src/pages/Blog.tsx');
const MYTHERAPY_TSX = path.resolve(__dirname, IS_CI ? '../../osrodek/src/pages/MyTherapy.tsx' : '../../myway-revived-vision/src/pages/MyTherapy.tsx');
const SCHEDULED_DIR = path.resolve(__dirname, '../scheduled');

function readScheduledArticle(date) {
  const filePath = path.join(SCHEDULED_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function calculateReadTime(article) {
  let text = article.content.intro || '';
  (article.content.sections || []).forEach(s => { text += ' ' + s.title + ' ' + s.content; });
  (article.content.faq || []).forEach(f => { text += ' ' + f.question + ' ' + f.answer; });
  return Math.max(5, Math.ceil(text.split(/\s+/).length / 200));
}

function updateBlogTsx(article) {
  if (!fs.existsSync(BLOG_TSX)) {
    console.log('[Blog.tsx] File not found at:', BLOG_TSX);
    return;
  }

  let content = fs.readFileSync(BLOG_TSX, 'utf-8');

  // Check for duplicate
  if (content.includes(article.slug)) {
    console.log('[Blog.tsx] Article already exists, skipping:', article.slug);
    return;
  }

  // Find the articles array opening
  const arrayStart = content.indexOf('const articles = [');
  if (arrayStart === -1) {
    console.error('[Blog.tsx] Could not find articles array');
    return;
  }

  const insertPos = content.indexOf('[', arrayStart) + 1;

  const newEntry = `\n    {\n` +
    `      title: '${article.title.replace(/'/g, "\\'")}',\n` +
    `      description: '${article.excerpt.replace(/'/g, "\\'")}',\n` +
    `      url: '/blog/${article.slug}',\n` +
    `      image: '${article.image}',\n` +
    `      date: '${article.dateFormatted}'\n` +
    `    },`;

  content = content.slice(0, insertPos) + newEntry + content.slice(insertPos);
  fs.writeFileSync(BLOG_TSX, content);
  console.log('[Blog.tsx] Added article:', article.slug);
}

function updateMyTherapyTsx(article) {
  if (!fs.existsSync(MYTHERAPY_TSX)) {
    console.log('[MyTherapy.tsx] File not found at:', MYTHERAPY_TSX);
    return;
  }

  let content = fs.readFileSync(MYTHERAPY_TSX, 'utf-8');

  // Check for duplicate
  if (content.includes(article.slug)) {
    console.log('[MyTherapy.tsx] Article already exists, skipping:', article.slug);
    return;
  }

  // Find the lowest existing id to generate next one
  const idMatches = content.match(/id:\s*(-?\d+)/g);
  let nextId = -1;
  if (idMatches) {
    const ids = idMatches.map(m => parseInt(m.replace(/id:\s*/, '')));
    nextId = Math.min(...ids) - 1;
  }

  const readTime = calculateReadTime(article);

  // Find the articles array opening
  const arrayStart = content.indexOf('const articles = [');
  if (arrayStart === -1) {
    console.error('[MyTherapy.tsx] Could not find articles array');
    return;
  }

  const insertPos = content.indexOf('[', arrayStart) + 1;

  const newEntry = `\n    {\n` +
    `      id: ${nextId},\n` +
    `      title: "${article.title.replace(/"/g, '\\"')}",\n` +
    `      excerpt: "${article.excerpt.replace(/"/g, '\\"')}",\n` +
    `      image: "${article.image}",\n` +
    `      category: "${article.category}",\n` +
    `      readTime: "${readTime} min",\n` +
    `      slug: "${article.slug}",\n` +
    `      date: "${article.dateFormatted}"\n` +
    `    },`;

  content = content.slice(0, insertPos) + newEntry + content.slice(insertPos);
  fs.writeFileSync(MYTHERAPY_TSX, content);
  console.log('[MyTherapy.tsx] Added article with id:', nextId);
}

function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: node update-osrodek-feeds.cjs YYYY-MM-DD');
    process.exit(1);
  }

  const article = readScheduledArticle(date);
  if (!article) {
    console.log('No article found for', date);
    process.exit(0);
  }

  updateBlogTsx(article);
  updateMyTherapyTsx(article);
}

main();
