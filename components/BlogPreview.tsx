import React from 'react';
import { ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    slug: 'jak-wybrac-osrodek-terapii-uzaleznien',
    title: 'Jak wybrać ośrodek terapii uzależnień?',
    excerpt: 'Poznaj 7 kluczowych kryteriów, które pomogą Ci podjąć właściwą decyzję i uniknąć kosztownych błędów.',
    category: 'Wybór ośrodka',
    date: '28 sty 2026',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop'
  },
  {
    slug: 'ile-kosztuje-leczenie-uzaleznienia',
    title: 'Ile kosztuje leczenie uzależnienia w 2026?',
    excerpt: 'Ceny od 5 000 do 35 000 zł/miesiąc. Sprawdź, co wpływa na cenę i jak sfinansować leczenie.',
    category: 'Koszty',
    date: '25 sty 2026',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop'
  },
  {
    slug: 'ile-trwa-terapia-uzaleznien',
    title: 'Ile trwa terapia uzależnień?',
    excerpt: 'Od 4 do 12 tygodni. Dowiedz się, dlaczego dłuższy pobyt zwiększa szanse na trwałą trzeźwość.',
    category: 'Proces',
    date: '20 sty 2026',
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=500&fit=crop'
  }
];

export const BlogPreview: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-wider">Blog</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Wiedza o terapii uzależnień
            </h2>
          </div>
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:gap-3 transition-all"
          >
            Wszystkie artykuły
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <a href={`/blog/${post.slug}/`} className="block">
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <time className="text-xs text-slate-500 dark:text-slate-400">{post.date}</time>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    Czytaj więcej
                    <ArrowRight size={16} />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
