#!/usr/bin/env node
/**
 * Blog Article Publisher
 * Generates articles for all 4 MyWay sites from a single JSON source
 */

const fs = require('fs');
const path = require('path');

// Paths configuration - CI uses short checkout names, local uses full folder names
const IS_CI = process.env.GITHUB_ACTIONS === 'true';

const PATHS = {
  ranking: path.resolve(__dirname, '../public/blog'),
  katalog: path.resolve(__dirname, IS_CI ? '../../katalog/blog' : '../../katalog-o-rodk-w/blog'),
  eduway: path.resolve(__dirname, IS_CI ? '../../eduway' : '../../eduway-platformaedukacyjna'),
  osrodek: path.resolve(__dirname, IS_CI ? '../../osrodek/src/pages/articles' : '../../myway-revived-vision/src/pages/articles'),
  osrodekApp: path.resolve(__dirname, IS_CI ? '../../osrodek/src/App.tsx' : '../../myway-revived-vision/src/App.tsx'),
};

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Read scheduled article for a given date
function readScheduledArticle(date) {
  const scheduledPath = path.resolve(__dirname, '../scheduled', `${date}.json`);
  if (!fs.existsSync(scheduledPath)) {
    console.log(`No article scheduled for ${date}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(scheduledPath, 'utf-8'));
}

// Category color mapping
function getCategoryColors(category, site) {
  const colors = {
    'Wiedza': { ranking: 'blue', katalog: 'blue', eduway: 'blue' },
    'Rodzina': { ranking: 'red', katalog: 'red', eduway: 'red' },
    'Terapia': { ranking: 'green', katalog: 'green', eduway: 'green' },
    'Medycyna': { ranking: 'purple', katalog: 'purple', eduway: 'purple' },
    'Pierwszy krok': { ranking: 'amber', katalog: 'amber', eduway: 'amber' },
    'Przygotowanie': { ranking: 'indigo', katalog: 'indigo', eduway: 'indigo' },
  };
  return colors[category]?.[site] || 'blue';
}

// Generate HTML for Ranking site (light Tailwind theme)
function generateRankingHTML(article) {
  const sectionsHTML = article.content.sections.map(s => `
                <h3 class="text-xl font-bold mt-6 mb-3">${s.title}</h3>
                <div class="prose-content">${s.content.split('\n\n').map(p => {
                  if (p.startsWith('**') && p.includes(':**')) {
                    return `<p class="font-semibold mt-4">${p.replace(/\*\*/g, '')}</p>`;
                  }
                  if (p.startsWith('- ')) {
                    return `<ul class="list-disc pl-6 space-y-1">${p.split('\n').map(li => `<li>${li.replace(/^- /, '')}</li>`).join('')}</ul>`;
                  }
                  if (p.match(/^\d\. /)) {
                    return `<ol class="list-decimal pl-6 space-y-1">${p.split('\n').map(li => `<li>${li.replace(/^\d\. /, '')}</li>`).join('')}</ol>`;
                  }
                  return `<p>${p}</p>`;
                }).join('\n                ')}</div>`).join('\n');

  const faqHTML = article.content.faq.map((f, i) => `
                <h3 class="text-xl font-bold mt-6 mb-3">${f.question}</h3>
                <p>${f.answer}</p>`).join('\n');

  const relatedHTML = article.relatedArticles.map(r => `
                    <a href="/blog/${r.slug}/" class="block p-4 bg-white rounded-xl border hover:border-primary-300">
                        <span class="text-xs text-slate-500">${r.category}</span>
                        <p class="font-semibold mt-1 text-slate-900">${r.title}</p>
                    </a>`).join('\n');

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.content.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  });

  return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.description}">
    <link rel="canonical" href="https://rankingosrodkowterapii.pl/blog/${article.slug}/">

    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="${article.date}">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:{50:'#f0f9ff',500:'#0ea5e9',600:'#0284c7',700:'#0369a1'},gold:{500:'#eab308',600:'#ca8a04'}}}}}</script>

    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"${article.title}","datePublished":"${article.date}","author":{"@type":"Person","name":"Krystian Nagaba"},"publisher":{"@type":"Organization","name":"Ranking Ośrodków"}}
    </script>

    <script type="application/ld+json">
    ${faqSchema}
    </script>

    <style>.glass-panel{background:rgba(255,255,255,0.7);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.3)}.dark .glass-panel{background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.1)}</style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen">
    <header class="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-xl font-bold">Ranking Ośrodków</a>
            <nav class="flex gap-6 text-sm font-medium">
                <a href="/" class="text-slate-600 hover:text-primary-600">Ranking</a>
                <a href="/blog/" class="text-primary-600">Blog</a>
            </nav>
        </div>
    </header>

    <main class="pt-24 pb-16">
        <article class="max-w-3xl mx-auto px-4">
            <nav class="text-sm text-slate-500 mb-8">
                <a href="/">Ranking</a> / <a href="/blog/">Blog</a> / ${article.title.split(' - ')[0]}
            </nav>

            <header class="mb-12">
                <span class="bg-${getCategoryColors(article.category, 'ranking')}-100 text-${getCategoryColors(article.category, 'ranking')}-700 px-3 py-1 rounded-full text-sm font-medium">${article.category}</span>
                <time class="text-slate-500 text-sm ml-3">${article.dateFormatted}</time>
                <h1 class="text-4xl font-black mt-4 mb-6">${article.title}</h1>
                <p class="text-xl text-slate-600">${article.excerpt}</p>
            </header>

            <div class="prose prose-lg max-w-none">
                <p class="lead">${article.content.intro}</p>
${sectionsHTML}

                <div class="bg-primary-50 border-l-4 border-primary-500 p-4 my-6 rounded-r-lg text-slate-900">
                    <p class="font-semibold text-slate-900">${article.content.callout.icon === 'info' ? '💡' : '⚠️'} ${article.content.callout.title}</p>
                    <p class="mt-1 text-slate-800">${article.content.callout.text}</p>
                </div>

                <h2 id="faq" class="text-2xl font-bold mt-10 mb-4">Najczęściej zadawane pytania</h2>
${faqHTML}

                <p class="mt-8">Potrzebujesz pomocy? <a href="tel:+48${article.content.cta.phone.replace(/\s/g, '')}" class="text-primary-600 font-semibold">Zadzwoń: ${article.content.cta.phone}</a></p>
            </div>

            <div class="mt-16">
                <h3 class="text-xl font-bold mb-6">Powiązane artykuły</h3>
                <div class="grid md:grid-cols-2 gap-6">
${relatedHTML}
                </div>
            </div>
        </article>

        <section class="max-w-3xl mx-auto px-4 mt-20">
            <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-center text-white">
                <h2 class="text-2xl font-bold mb-4">${article.content.cta.title}</h2>
                <p class="text-primary-100 mb-6">${article.content.cta.subtitle}</p>
                <a href="tel:+48${article.content.cta.phone.replace(/\s/g, '')}" class="inline-flex items-center gap-3 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold">${article.content.cta.phone}</a>
            </div>
        </section>
    </main>

    <footer class="bg-white border-t py-12 text-center text-sm text-slate-500">
        <p>© 2026 Ranking Ośrodków Terapii Uzależnień</p>
    </footer>
    <script>if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')</script>
</body>
</html>`;
}

// Generate HTML for Katalog site (dark premium gold theme)
function generateKatalogHTML(article) {
  const sectionsHTML = article.content.sections.map(s => `
                <div class="signal-card">
                    <h3>${s.title}</h3>
                    ${s.content.split('\n\n').map(p => {
                      if (p.startsWith('**') && p.includes(':**')) {
                        return `<p class="warning-label">${p.replace(/\*\*/g, '')}</p>`;
                      }
                      if (p.startsWith('- ')) {
                        return `<ul>${p.split('\n').map(li => `<li>${li.replace(/^- /, '')}</li>`).join('')}</ul>`;
                      }
                      if (p.match(/^\d\. /)) {
                        return `<ol>${p.split('\n').map(li => `<li>${li.replace(/^\d\. /, '')}</li>`).join('')}</ol>`;
                      }
                      return `<p>${p}</p>`;
                    }).join('\n                    ')}
                </div>`).join('\n');

  const faqHTML = article.content.faq.map((f, i) => `
                <details class="faq-item">
                    <summary>${f.question}</summary>
                    <p>${f.answer}</p>
                </details>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | Katalog Ośrodków Premium</title>
    <meta name="description" content="${article.description}">
    <link rel="canonical" href="https://katalogosrodkow.pl/blog/${article.slug}/">

    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:type" content="article">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">

    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Article","headline":"${article.title}","datePublished":"${article.date}","author":{"@type":"Person","name":"Krystian Nagaba"},"publisher":{"@type":"Organization","name":"Katalog Ośrodków Premium"}}
    </script>

    <style>
        :root {
            --bg-body: #0a0b0e;
            --bg-card: #13151a;
            --gold-start: #d4af37;
            --gold-end: #aa8420;
            --gold-text: #e5c567;
            --text-main: #f0f0f0;
            --text-muted: #aab2c0;
            --border-subtle: rgba(255, 255, 255, 0.1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Manrope', sans-serif; }
        body {
            background-color: var(--bg-body);
            color: var(--text-main);
            line-height: 1.7;
            background-image: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%);
        }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        .gold-text { background: linear-gradient(135deg, #fce38a, #d4af37, #aa8420); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        a { color: var(--gold-text); text-decoration: none; }
        a:hover { text-decoration: underline; }

        .site-header {
            position: fixed; top: 0; left: 0; right: 0; z-index: 100;
            background: rgba(10, 11, 14, 0.95); backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-subtle);
        }
        .header-inner { max-width: 900px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 12px; color: #fff; }
        .logo-icon { width: 16px; height: 16px; background: linear-gradient(135deg, var(--gold-start), var(--gold-end)); transform: rotate(45deg); }
        .logo span { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
        nav a { color: var(--text-muted); font-size: 0.85rem; margin-left: 1.5rem; }

        main { max-width: 800px; margin: 0 auto; padding: 100px 1.5rem 60px; }

        .breadcrumb { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 2rem; }
        .breadcrumb a { color: var(--text-muted); }

        article header { margin-bottom: 3rem; }
        .category-badge { background: rgba(212, 175, 55, 0.15); color: var(--gold-text); padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; display: inline-block; }
        .article-date { color: var(--text-muted); font-size: 0.85rem; margin-left: 1rem; }
        h1 { font-size: 2.2rem; margin: 1.5rem 0; line-height: 1.3; }
        .lead { font-size: 1.15rem; color: var(--text-muted); }

        .content { font-size: 1rem; }
        .content h2 { font-size: 1.5rem; margin: 2.5rem 0 1rem; color: var(--gold-text); }
        .content p { margin-bottom: 1rem; color: var(--text-muted); }
        .content ul, .content ol { margin: 1rem 0; padding-left: 1.5rem; color: var(--text-muted); }
        .content li { margin-bottom: 0.5rem; }

        .signal-card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        .signal-card h3 { font-size: 1.1rem; color: #fff; margin-bottom: 1rem; }
        .signal-card p { color: var(--text-muted); margin-bottom: 0.75rem; }
        .signal-card .warning-label { color: var(--gold-text); font-weight: 600; margin-top: 1rem; }
        .signal-card ul { list-style: none; padding: 0; }
        .signal-card li { padding-left: 1.5rem; position: relative; margin-bottom: 0.5rem; color: var(--text-muted); }
        .signal-card li::before { content: "→"; position: absolute; left: 0; color: var(--gold-text); }

        .callout {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        .callout-title { color: var(--gold-text); font-weight: 700; margin-bottom: 0.5rem; }
        .callout p { color: var(--text-main); margin: 0; }

        .faq-item {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        .faq-item summary {
            padding: 1rem 1.5rem;
            cursor: pointer;
            font-weight: 600;
            color: #fff;
            list-style: none;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item[open] summary { border-bottom: 1px solid var(--border-subtle); }
        .faq-item p { padding: 1rem 1.5rem; color: var(--text-muted); margin: 0; }

        .cta-box {
            background: linear-gradient(135deg, var(--gold-start), var(--gold-end));
            border-radius: 16px;
            padding: 2.5rem;
            text-align: center;
            margin: 3rem 0;
        }
        .cta-box h2 { color: #000; margin-bottom: 0.5rem; }
        .cta-box p { color: rgba(0,0,0,0.7); margin-bottom: 1.5rem; }
        .cta-phone {
            display: inline-block;
            background: #000;
            color: var(--gold-text);
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.25rem;
            font-weight: 700;
        }

        footer {
            text-align: center;
            padding: 2rem;
            border-top: 1px solid var(--border-subtle);
            color: var(--text-muted);
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="header-inner">
            <a href="/" class="logo">
                <div class="logo-icon"></div>
                <span>Katalog Ośrodków</span>
            </a>
            <nav>
                <a href="/">Katalog</a>
                <a href="/blog/" style="color: var(--gold-text);">Blog</a>
            </nav>
        </div>
    </header>

    <main>
        <nav class="breadcrumb">
            <a href="/">Katalog</a> / <a href="/blog/">Blog</a> / ${article.category}
        </nav>

        <article>
            <header>
                <span class="category-badge">${article.category}</span>
                <time class="article-date">${article.dateFormatted}</time>
                <h1>${article.title}</h1>
                <p class="lead">${article.excerpt}</p>
            </header>

            <div class="content">
                <p>${article.content.intro}</p>

${sectionsHTML}

                <div class="callout">
                    <p class="callout-title">${article.content.callout.icon === 'info' ? '💡' : '⚠️'} ${article.content.callout.title}</p>
                    <p>${article.content.callout.text}</p>
                </div>

                <h2>Najczęściej zadawane pytania</h2>
${faqHTML}
            </div>

            <div class="cta-box">
                <h2>${article.content.cta.title}</h2>
                <p>${article.content.cta.subtitle}</p>
                <a href="tel:+48${article.content.cta.phone.replace(/\s/g, '')}" class="cta-phone">${article.content.cta.phone}</a>
            </div>
        </article>
    </main>

    <footer>
        <p>© 2026 Katalog Ośrodków Premium</p>
    </footer>
</body>
</html>`;
}

// Generate HTML for EduWay site (dark glass theme)
function generateEduwayHTML(article) {
  const sectionsHTML = article.content.sections.map((s, i) => {
    const colors = ['from-blue-500/20 to-cyan-500/20 border-blue-500/30', 'from-purple-500/20 to-pink-500/20 border-purple-500/30', 'from-green-500/20 to-emerald-500/20 border-green-500/30', 'from-orange-500/20 to-red-500/20 border-orange-500/30', 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30'];
    const color = colors[i % colors.length];
    return `
            <section class="bg-gradient-to-br ${color} border rounded-2xl p-6 mb-6">
                <h2 class="text-xl font-bold text-white mb-4">${s.title}</h2>
                ${s.content.split('\n\n').map(p => {
                  if (p.startsWith('**') && p.includes(':**')) {
                    return `<p class="text-yellow-300 font-semibold mt-4">${p.replace(/\*\*/g, '')}</p>`;
                  }
                  if (p.startsWith('- ')) {
                    return `<ul class="list-disc pl-6 space-y-1 text-gray-300">${p.split('\n').map(li => `<li>${li.replace(/^- /, '')}</li>`).join('')}</ul>`;
                  }
                  if (p.match(/^\d\. /)) {
                    return `<ol class="list-decimal pl-6 space-y-1 text-gray-300">${p.split('\n').map(li => `<li>${li.replace(/^\d\. /, '')}</li>`).join('')}</ol>`;
                  }
                  return `<p class="text-gray-300 mb-3">${p}</p>`;
                }).join('\n                ')}
            </section>`;
  }).join('\n');

  const faqHTML = article.content.faq.map(f => `
            <details class="bg-white/5 border border-white/10 rounded-xl mb-3">
                <summary class="p-4 cursor-pointer text-white font-medium">${f.question}</summary>
                <p class="px-4 pb-4 text-gray-400">${f.answer}</p>
            </details>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | EduMyWay</title>
    <meta name="description" content="${article.description}">
    <link rel="canonical" href="https://edu-myway.pl/blog/${article.slug}.html">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config={theme:{extend:{colors:{glass:{dark:'rgba(15,23,42,0.8)'}}}}}</script>

    <style>
        .glass-dark { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
    </style>

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6GS71KVGGC"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6GS71KVGGC');</script>
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
    <header class="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">EduMyWay</a>
            <nav class="flex gap-6 text-sm">
                <a href="/" class="text-gray-400 hover:text-white">Kursy</a>
                <a href="/blog.html" class="text-cyan-400">Blog</a>
            </nav>
        </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <nav class="text-sm text-gray-500 mb-8">
            <a href="/" class="hover:text-white">Start</a> / <a href="/blog.html" class="hover:text-white">Blog</a> / ${article.category}
        </nav>

        <article>
            <header class="mb-10">
                <span class="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">${article.category}</span>
                <time class="text-gray-500 text-sm ml-3">${article.dateFormatted}</time>
                <h1 class="text-3xl md:text-4xl font-bold mt-4 mb-4">${article.title}</h1>
                <p class="text-lg text-gray-400">${article.excerpt}</p>
            </header>

            <div class="prose prose-invert max-w-none">
                <p class="text-gray-300 text-lg mb-8">${article.content.intro}</p>

${sectionsHTML}

            <div class="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6 my-8">
                <p class="text-cyan-300 font-bold">${article.content.callout.icon === 'info' ? '💡' : '⚠️'} ${article.content.callout.title}</p>
                <p class="text-gray-300 mt-2">${article.content.callout.text}</p>
            </div>

            <h2 class="text-2xl font-bold mt-10 mb-6">FAQ</h2>
${faqHTML}
            </div>
        </article>

        <section class="mt-16">
            <div class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-center">
                <h2 class="text-2xl font-bold mb-2">${article.content.cta.title}</h2>
                <p class="text-cyan-100 mb-6">${article.content.cta.subtitle}</p>
                <a href="tel:+48${article.content.cta.phone.replace(/\s/g, '')}" class="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg">${article.content.cta.phone}</a>
            </div>
        </section>
    </main>

    <footer class="text-center py-8 text-gray-500 text-sm border-t border-white/10">
        <p>© 2026 EduMyWay - Platforma Edukacyjna</p>
    </footer>
</body>
</html>`;
}

// Helper: calculate read time from article content
function calculateReadTime(article) {
  let text = article.content.intro || '';
  (article.content.sections || []).forEach(s => { text += ' ' + s.title + ' ' + s.content; });
  (article.content.faq || []).forEach(f => { text += ' ' + f.question + ' ' + f.answer; });
  return Math.max(5, Math.ceil(text.split(/\s+/).length / 200));
}

// Generate TSX for osrodek-myway (React) - full article structure
function generateOsrodekTSX(article) {
  const componentName = article.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Article';

  const slugUnderscored = article.slug.replace(/-/g, '_');
  const readTime = calculateReadTime(article);
  const shortTitle = article.title.split(/\s*[-–?]\s*/)[0].trim();
  const heroImage = article.image.includes('?')
    ? article.image.replace(/w=\d+/, 'w=1024').replace(/h=\d+/, 'h=576')
    : article.image + '?w=1024&h=576&fit=crop';

  // Category-based styling
  const bgColorMap = { blue: 'blue-50', red: 'rose-50', green: 'green-50', purple: 'purple-50', amber: 'amber-50', indigo: 'indigo-50' };
  const bgColor = bgColorMap[article.categoryColor] || 'blue-50';
  const sectionIcon = article.category === 'Rodzina' ? 'Heart' : 'AlertTriangle';
  const iconColor = article.category === 'Rodzina' ? 'text-red-500' : 'text-amber-500';

  // Escape for JSX attributes
  const ea = (s) => (s || '').replace(/"/g, '&quot;');

  // Convert **bold** to <strong>
  const boldify = (s) => (s || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Parse section content into JSX
  function parseSectionContent(content) {
    const blocks = (content || '').split('\n\n');
    const parts = [];

    for (const block of blocks) {
      const lines = block.split('\n').filter(l => l.trim());
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('**') && line.includes(':**')) {
          parts.push('                    <p className="text-sm font-semibold text-amber-700 mt-3 mb-1">' + boldify(line) + '</p>');
          i++;
        } else if (line.startsWith('- ')) {
          const items = [];
          while (i < lines.length && lines[i].startsWith('- ')) {
            items.push(lines[i].replace(/^- /, ''));
            i++;
          }
          const itemsJSX = items.map(item => '                      <li>' + boldify(item) + '</li>').join('\n');
          parts.push('                    <ul className="text-gray-700 text-sm space-y-1 ml-4 list-disc">\n' + itemsJSX + '\n                    </ul>');
        } else if (line.match(/^\d+\. /)) {
          const items = [];
          while (i < lines.length && lines[i].match(/^\d+\. /)) {
            items.push(lines[i].replace(/^\d+\. /, ''));
            i++;
          }
          const itemsJSX = items.map(item => '                      <li>' + boldify(item) + '</li>').join('\n');
          parts.push('                    <ol className="text-gray-700 text-sm space-y-1 ml-4 list-decimal">\n' + itemsJSX + '\n                    </ol>');
        } else {
          parts.push('                    <p className="text-gray-700 mb-3">' + boldify(line) + '</p>');
          i++;
        }
      }
    }

    return parts.join('\n');
  }

  // Build section cards
  const sectionCards = article.content.sections.map(s => {
    const content = parseSectionContent(s.content);
    return '                  <div className="bg-white rounded-xl p-5">\n                    <h3 className="font-bold text-gray-900 mb-2">' + boldify(s.title) + '</h3>\n' + content + '\n                  </div>';
  }).join('\n\n');

  // Build FAQ items
  const faqItems = article.content.faq.map((f, i) =>
    '                  <AccordionItem value="item-' + (i + 1) + '" className="border rounded-xl px-6 bg-white">\n' +
    '                    <AccordionTrigger className="text-left font-semibold text-gray-900">\n' +
    '                      ' + ea(f.question) + '\n' +
    '                    </AccordionTrigger>\n' +
    '                    <AccordionContent className="text-gray-700">\n' +
    '                      ' + ea(f.answer) + '\n' +
    '                    </AccordionContent>\n' +
    '                  </AccordionItem>'
  ).join('\n');

  // Build FAQ schema entries
  const faqSchemaEntries = article.content.faq.map(f =>
    '      {\n' +
    '        "@type": "Question",\n' +
    '        "name": ' + JSON.stringify(f.question) + ',\n' +
    '        "acceptedAnswer": {\n' +
    '          "@type": "Answer",\n' +
    '          "text": ' + JSON.stringify(f.answer) + '\n' +
    '        }\n' +
    '      }'
  ).join(',\n');

  // Build related articles
  const relatedArticles = (article.relatedArticles || []).map(r =>
    '              <Link to="/blog/' + r.slug + '" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">\n' +
    '                <h3 className="font-semibold text-gray-900 mb-2">' + ea(r.title) + '</h3>\n' +
    '                <p className="text-gray-600 text-sm">' + ea(r.category) + '</p>\n' +
    '              </Link>'
  ).join('\n');

  // Build AEO questions from FAQ
  const aeoText = article.content.faq.map(f => f.question).join(' ');

  // Phone
  const phone = article.content.cta.phone;
  const phoneClean = phone.replace(/\s/g, '');

  // Related articles section
  const relatedSection = (article.relatedArticles || []).length > 0
    ? '\n        {/* Related Articles */}\n' +
      '        <section className="bg-gray-50 py-12">\n' +
      '          <div className="container mx-auto px-4">\n' +
      '            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Powiązane artykuły</h2>\n' +
      '            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">\n' +
      relatedArticles + '\n' +
      '            </div>\n' +
      '          </div>\n' +
      '        </section>'
    : '';

  return 'import React from \'react\';\n' +
'import { Helmet } from \'react-helmet\';\n' +
'import { Link } from \'react-router-dom\';\n' +
'import { ArrowLeft, Phone, Clock, Calendar, AlertTriangle, Heart } from \'lucide-react\';\n' +
'import Header from \'@/components/Layout/Header\';\n' +
'import Footer from \'@/components/Sections/Footer\';\n' +
'import ArticleSidebar from \'@/components/ArticleSidebar\';\n' +
'import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from \'@/components/ui/accordion\';\n' +
'import ksiazkaImage from \'@/assets/ksiazka-wygraj-trzezwe-zycie.png\';\n' +
'\n' +
'const ' + componentName + ' = () => {\n' +
'  const handlePhoneClick = () => {\n' +
'    if (typeof window !== \'undefined\' && (window as any).gtag) {\n' +
'      (window as any).gtag(\'event\', \'phone_click\', {\n' +
'        event_category: \'Contact\',\n' +
'        event_label: \'' + slugUnderscored + '_article_phone\'\n' +
'      });\n' +
'    }\n' +
'  };\n' +
'\n' +
'  const articleSchema = {\n' +
'    "@context": "https://schema.org",\n' +
'    "@type": "Article",\n' +
'    "headline": ' + JSON.stringify(article.title) + ',\n' +
'    "description": ' + JSON.stringify(article.description) + ',\n' +
'    "image": "' + heroImage + '",\n' +
'    "author": {\n' +
'      "@type": "Person",\n' +
'      "name": "Krystian Nagaba",\n' +
'      "url": "https://krystiannagaba.pl"\n' +
'    },\n' +
'    "publisher": {\n' +
'      "@type": "Organization",\n' +
'      "name": "Ośrodek MyWay",\n' +
'      "logo": {\n' +
'        "@type": "ImageObject",\n' +
'        "url": "https://osrodek-myway.pl/lovable-uploads/myway-logo-transparent.png"\n' +
'      }\n' +
'    },\n' +
'    "datePublished": "' + article.date + '",\n' +
'    "dateModified": "' + article.date + '"\n' +
'  };\n' +
'\n' +
'  const faqSchema = {\n' +
'    "@context": "https://schema.org",\n' +
'    "@type": "FAQPage",\n' +
'    "mainEntity": [\n' +
faqSchemaEntries + '\n' +
'    ]\n' +
'  };\n' +
'\n' +
'  return (\n' +
'    <>\n' +
'      <Helmet>\n' +
'        <title>' + ea(article.title) + ' | Ośrodek MyWay</title>\n' +
'        <meta name="description" content="' + ea(article.description) + '" />\n' +
'        <link rel="canonical" href="https://osrodek-myway.pl/blog/' + article.slug + '" />\n' +
'        <meta property="og:title" content="' + ea(article.title) + ' | Ośrodek MyWay" />\n' +
'        <meta property="og:description" content="' + ea(article.description) + '" />\n' +
'        <meta property="og:url" content="https://osrodek-myway.pl/blog/' + article.slug + '" />\n' +
'        <meta property="og:type" content="article" />\n' +
'        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>\n' +
'        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>\n' +
'      </Helmet>\n' +
'\n' +
'      <Header />\n' +
'\n' +
'      <main className="min-h-screen bg-white">\n' +
'        {/* Breadcrumbs */}\n' +
'        <nav className="bg-blue-50 py-4" aria-label="Breadcrumb">\n' +
'          <div className="container mx-auto px-4">\n' +
'            <ol className="flex items-center space-x-2 text-sm">\n' +
'              <li><Link to="/" className="text-gray-600 hover:text-primary">Strona główna</Link></li>\n' +
'              <li className="text-gray-400">/</li>\n' +
'              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Blog</Link></li>\n' +
'              <li className="text-gray-400">/</li>\n' +
'              <li className="text-gray-900 font-medium">' + shortTitle + '</li>\n' +
'            </ol>\n' +
'          </div>\n' +
'        </nav>\n' +
'\n' +
'        <article className="container mx-auto px-4 py-12">\n' +
'          <div className="grid lg:grid-cols-3 gap-8">\n' +
'            {/* Main Content */}\n' +
'            <div className="lg:col-span-2">\n' +
'              <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">\n' +
'                <ArrowLeft className="w-4 h-4 mr-2" />\n' +
'                Powrót do bloga\n' +
'              </Link>\n' +
'\n' +
'              <header className="mb-8">\n' +
'                <h1 className="font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-4">\n' +
'                  ' + article.title + '\n' +
'                </h1>\n' +
'                <p className="font-inter text-xl text-gray-600 mb-4">\n' +
'                  ' + article.excerpt + '\n' +
'                </p>\n' +
'                <div className="flex items-center gap-4 text-sm text-gray-500">\n' +
'                  <span className="flex items-center gap-1">\n' +
'                    <Calendar className="w-4 h-4" />\n' +
'                    ' + article.dateFormatted + '\n' +
'                  </span>\n' +
'                  <span className="flex items-center gap-1">\n' +
'                    <Clock className="w-4 h-4" />\n' +
'                    ' + readTime + ' min czytania\n' +
'                  </span>\n' +
'                </div>\n' +
'              </header>\n' +
'\n' +
'              <img\n' +
'                src="' + heroImage + '"\n' +
'                alt="' + ea(article.imageAlt || article.title) + '"\n' +
'                className="w-full h-auto rounded-xl mb-8"\n' +
'                width={1024}\n' +
'                height={576}\n' +
'                loading="eager"\n' +
'              />\n' +
'\n' +
'              {/* Intro */}\n' +
'              <section className="prose prose-lg max-w-none mb-12">\n' +
'                <p className="text-lg text-gray-700 leading-relaxed">\n' +
'                  ' + boldify(article.content.intro) + '\n' +
'                </p>\n' +
'                <p className="text-gray-700 leading-relaxed">\n' +
'                  <a href="https://krystiannagaba.pl" className="text-primary hover:underline">Krystian Nagaba</a>, terapeuta uzależnień i autor książki <a href="https://wygrajtrzezwezycie.pl" className="text-primary hover:underline">&quot;Wygraj trzeźwe życie&quot;</a>, pomaga zrozumieć mechanizmy uzależnienia od ponad 15 lat.\n' +
'                </p>\n' +
'              </section>\n' +
'\n' +
'              {/* Book CTA */}\n' +
'              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center gap-6">\n' +
'                <img src={ksiazkaImage} alt="Książka Wygraj Trzeźwe Życie" className="w-32 h-auto rounded-lg shadow-lg" />\n' +
'                <div>\n' +
'                  <h3 className="font-bold text-xl text-gray-900 mb-2">Polecana lektura</h3>\n' +
'                  <p className="text-gray-700 mb-3">Książka &quot;Wygraj trzeźwe życie&quot; szczegółowo opisuje mechanizmy uzależnienia i drogę do trzeźwości.</p>\n' +
'                  <a href="https://wygrajtrzezwezycie.pl" className="inline-flex items-center text-primary font-semibold hover:underline">\n' +
'                    Zamów książkę →\n' +
'                  </a>\n' +
'                </div>\n' +
'              </div>\n' +
'\n' +
'              {/* Main Sections */}\n' +
'              <section className="bg-' + bgColor + ' rounded-2xl p-8 mb-12">\n' +
'                <h2 className="font-inter text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">\n' +
'                  <' + sectionIcon + ' className="w-6 h-6 ' + iconColor + '" />\n' +
'                  ' + shortTitle + '\n' +
'                </h2>\n' +
'\n' +
'                <div className="space-y-6">\n' +
sectionCards + '\n' +
'                </div>\n' +
'              </section>\n' +
'\n' +
'              {/* Callout */}\n' +
'              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-12">\n' +
'                <p className="font-bold text-blue-900">' + (article.content.callout.icon === 'info' ? '💡' : '⚠️') + ' ' + article.content.callout.title + '</p>\n' +
'                <p className="text-blue-800 mt-2">' + article.content.callout.text + '</p>\n' +
'              </div>\n' +
'\n' +
'              {/* Book CTA #2 */}\n' +
'              <div className="border-2 border-primary rounded-2xl p-6 mb-12">\n' +
'                <div className="flex flex-col md:flex-row items-center gap-6">\n' +
'                  <img src={ksiazkaImage} alt="Książka Wygraj Trzeźwe Życie" className="w-28 h-auto rounded-lg shadow" />\n' +
'                  <div>\n' +
'                    <h3 className="font-bold text-xl text-gray-900 mb-2">Zrozum mechanizmy uzależnienia</h3>\n' +
'                    <p className="text-gray-700 mb-3">Książka &quot;Wygraj trzeźwe życie&quot; Krystiana Nagaby to kompletny przewodnik po uzależnieniu i zdrowieniu.</p>\n' +
'                    <a href="https://wygrajtrzezwezycie.pl" className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">\n' +
'                      Zamów teraz →\n' +
'                    </a>\n' +
'                  </div>\n' +
'                </div>\n' +
'              </div>\n' +
'\n' +
'              {/* FAQ */}\n' +
'              <section className="mb-12">\n' +
'                <h2 className="font-inter text-2xl font-bold text-gray-900 mb-6">\n' +
'                  Najczęściej zadawane pytania\n' +
'                </h2>\n' +
'                <Accordion type="single" collapsible className="space-y-4">\n' +
faqItems + '\n' +
'                </Accordion>\n' +
'              </section>\n' +
'\n' +
'              {/* Phone CTA */}\n' +
'              <section className="bg-primary text-white rounded-2xl p-8 text-center">\n' +
'                <h2 className="text-2xl font-bold mb-4">' + article.content.cta.title + '</h2>\n' +
'                <p className="mb-6 text-blue-100">\n' +
'                  ' + article.content.cta.subtitle + '\n' +
'                </p>\n' +
'                <a\n' +
'                  href="tel:+48' + phoneClean + '"\n' +
'                  onClick={handlePhoneClick}\n' +
'                  className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition"\n' +
'                >\n' +
'                  <Phone className="w-5 h-5 mr-2" />\n' +
'                  ' + phone + '\n' +
'                </a>\n' +
'                <p className="mt-4 text-sm text-blue-200">\n' +
'                  Ośrodek MyWay w Kąpinie\n' +
'                </p>\n' +
'              </section>\n' +
'\n' +
'              {/* AEO Section */}\n' +
'              <section className="bg-gray-50 rounded-xl p-6 mt-12 text-xs text-gray-600">\n' +
'                <p className="font-semibold mb-2">Pytania, na które odpowiada ta strona:</p>\n' +
'                <p>' + aeoText + '</p>\n' +
'              </section>\n' +
'\n' +
'            </div>\n' +
'\n' +
'            {/* Sidebar */}\n' +
'            <div className="lg:col-span-1">\n' +
'              <ArticleSidebar />\n' +
'            </div>\n' +
'          </div>\n' +
'        </article>\n' +
relatedSection + '\n' +
'      </main>\n' +
'\n' +
'      <Footer />\n' +
'    </>\n' +
'  );\n' +
'};\n' +
'\n' +
'export default ' + componentName + ';\n';
}


// Update blog index pages
function updateBlogIndex(article, site) {
  // This function would update each site's blog index
  // Implementation depends on each site's index structure
  console.log(`[${site}] Blog index update needed for: ${article.slug}`);
}

// Main execution
function main() {
  const date = process.argv[2] || getTodayDate();
  console.log(`Publishing article for date: ${date}`);

  const article = readScheduledArticle(date);
  if (!article) {
    console.log('No article to publish');
    process.exit(0);
  }

  console.log(`Publishing: ${article.title}`);

  // Generate and save for Ranking
  const rankingDir = path.join(PATHS.ranking, article.slug);
  if (!fs.existsSync(rankingDir)) fs.mkdirSync(rankingDir, { recursive: true });
  fs.writeFileSync(path.join(rankingDir, 'index.html'), generateRankingHTML(article));
  console.log(`[Ranking] Created: ${rankingDir}/index.html`);

  // Generate and save for Katalog
  const katalogDir = path.join(PATHS.katalog, article.slug);
  if (!fs.existsSync(katalogDir)) fs.mkdirSync(katalogDir, { recursive: true });
  fs.writeFileSync(path.join(katalogDir, 'index.html'), generateKatalogHTML(article));
  console.log(`[Katalog] Created: ${katalogDir}/index.html`);

  // Generate and save for EduWay
  const eduwayFile = path.join(PATHS.eduway, 'blog', `${article.slug}.html`);
  const eduwayBlogDir = path.join(PATHS.eduway, 'blog');
  if (!fs.existsSync(eduwayBlogDir)) fs.mkdirSync(eduwayBlogDir, { recursive: true });
  fs.writeFileSync(eduwayFile, generateEduwayHTML(article));
  console.log(`[EduWay] Created: ${eduwayFile}`);

  // Generate TSX for osrodek-myway
  const componentName = article.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Article';
  const osrodekFile = path.join(PATHS.osrodek, `${componentName}.tsx`);
  fs.writeFileSync(osrodekFile, generateOsrodekTSX(article));
  console.log(`[Osrodek] Created: ${osrodekFile}`);

  console.log('\n✅ Article generated for all sites!');
  console.log('\nNext steps:');
  console.log('1. Update blog index pages');
  console.log('2. Update App.tsx for osrodek-myway');
  console.log('3. Git commit and push all repos');
}

main();
