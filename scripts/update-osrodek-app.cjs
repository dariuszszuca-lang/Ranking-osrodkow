#!/usr/bin/env node
/**
 * Update osrodek-myway App.tsx with new article route
 */

const fs = require('fs');
const path = require('path');

const IS_CI = process.env.GITHUB_ACTIONS === 'true';
const APP_TSX = path.resolve(__dirname, IS_CI ? '../../osrodek/src/App.tsx' : '../../myway-revived-vision/src/App.tsx');
const SCHEDULED_DIR = path.resolve(__dirname, '../scheduled');

function readScheduledArticle(date) {
  const filePath = path.join(SCHEDULED_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function slugToComponentName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Article';
}

function main() {
  const date = process.argv[2];
  if (!date) {
    console.error('Usage: node update-osrodek-app.js YYYY-MM-DD');
    process.exit(1);
  }

  const article = readScheduledArticle(date);
  if (!article) {
    console.log('No article found for', date);
    process.exit(0);
  }

  const componentName = slugToComponentName(article.slug);

  let appTsx = fs.readFileSync(APP_TSX, 'utf-8');

  // Check if already imported
  if (appTsx.includes(componentName)) {
    console.log('[Osrodek] Route already exists for:', componentName);
    return;
  }

  // Find the last "Article = lazy(" import line (must be at module scope, before "const queryClient")
  const queryClientPos = appTsx.indexOf('const queryClient');
  const moduleScope = appTsx.slice(0, queryClientPos);
  const lastArticleMatch = moduleScope.lastIndexOf('Article = lazy(');
  if (lastArticleMatch === -1) {
    console.error('Could not find article imports');
    process.exit(1);
  }

  // Find the end of that import line
  const importLineEnd = appTsx.indexOf(';', lastArticleMatch) + 1;
  const lazyImport = `\nconst ${componentName} = lazy(() => import("./pages/articles/${componentName}"));`;

  appTsx = appTsx.slice(0, importLineEnd) + lazyImport + appTsx.slice(importLineEnd);

  // Add route before the catch-all route
  const catchAllRoute = appTsx.indexOf('<Route path="*"');
  if (catchAllRoute === -1) {
    console.error('Could not find catch-all route');
    process.exit(1);
  }

  const newRoute = `              <Route path="/blog/${article.slug}" element={<${componentName} />} />\n`;
  appTsx = appTsx.slice(0, catchAllRoute) + newRoute + appTsx.slice(catchAllRoute);

  fs.writeFileSync(APP_TSX, appTsx);
  console.log('[Osrodek] Added route for:', article.slug);
}

main();
