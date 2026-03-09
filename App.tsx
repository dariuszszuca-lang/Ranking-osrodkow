import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RankingCard } from './components/RankingCard';
import { BlogPreview } from './components/BlogPreview';
import { centers } from './data/centers';
import { Info, HelpCircle, FileText, Activity, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-gold-200 dark:selection:bg-gold-900">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Ranking List */}
        <section id="ranking" className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 relative z-10">
          <div className="space-y-12">
            {centers.map((center) => (
              <RankingCard key={center.id} center={center} />
            ))}
          </div>
        </section>

        {/* Editorial Standards (Trust Signals) */}
        <section className="py-20 bg-white border-y border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Transparentne Kryteria Oceny
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Jako niezależny podmiot, weryfikujemy ośrodki według 4 kluczowych filarów, aby zapewnić najwyższą jakość rekomendacji dla Ciebie i Twoich bliskich.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Activity className="w-8 h-8 text-primary-500" />,
                  title: "Skuteczność Kliniczna",
                  desc: "Analizujemy wskaźniki ukończenia terapii, metody evidence-based (oparte na dowodach) oraz zapobieganie nawrotom."
                },
                {
                  icon: <Users className="w-8 h-8 text-primary-500" />,
                  title: "Kadra i Kompetencje",
                  desc: "Weryfikujemy certyfikaty terapeutów, obecność lekarzy psychiatrów oraz stosunek liczby personelu do pacjentów."
                },
                {
                  icon: <FileText className="w-8 h-8 text-primary-500" />,
                  title: "Standard Pobytu",
                  desc: "Oceniamy warunki hotelowe, dyskrecję, wyżywienie oraz dostęp do stref relaksu, które wspierają proces zdrowienia."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl w-fit shadow-sm mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        <BlogPreview />

        {/* FAQ Section (SEO Optimized) */}
        <section id="faq" className="py-20 bg-slate-50 dark:bg-[#0B1120]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              Pytania i odpowiedzi (FAQ)
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: "Ile kosztuje pobyt w prywatnym ośrodku leczenia uzależnień w 2026 roku?",
                  a: "Ceny wahają się od 8 000 zł do nawet 35 000 zł za miesiąc terapii. Ośrodki premium (oznaczone $$$$) oferują w tej cenie indywidualne sesje, pełne wyżywienie, zakwaterowanie w wysokim standardzie oraz dostęp do rozbudowanego zaplecza rekreacyjnego. Cena zależy głównie od intensywności terapii i standardu hotelowego."
                },
                {
                  q: "Czym różni się ośrodek premium od standardowego?",
                  a: "Ośrodki premium, takie jak zwycięzca naszego rankingu MyWay, oferują przede wszystkim znacznie większą indywidualizację procesu (osobisty terapeuta), mniejsze grupy, absolutną anonimowość oraz warunki hotelowe 5-gwiazdkowe, co jest kluczowe dla osób publicznych i biznesu."
                },
                {
                  q: "Czy ośrodki zapewniają detoks?",
                  a: "Większość rekomendowanych przez nas placówek posiada oddział detoksykacyjny lub współpracuje ze szpitalami. Detoks jest pierwszym, medycznym etapem leczenia, po którym następuje właściwa psychoterapia."
                },
                {
                  q: "Jak długo trwa terapia stacjonarna?",
                  a: "Standardowy cykl terapeutyczny trwa od 4 do 8 tygodni. W przypadku głębokich uzależnień zaleca się pobyty dłuższe, nawet do 6 miesięcy. Minimalny czas potrzebny na stabilizację to zazwyczaj 28 dni."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {faq.q}
                    <span className="transform group-open:rotate-180 transition-transform text-slate-400">
                      <HelpCircle size={20} />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12 text-sm">
            <div className="col-span-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-4 block">
                Ranking Ośrodków
              </span>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                Niezależny ranking ośrodków terapeutycznych. Pomagamy podjąć najlepszą decyzję w trudnym momencie życia.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">O Rankingu</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li><a href="#metodologia" className="hover:text-primary-600">Metodologia</a></li>
                <li><a href="#faq" className="hover:text-primary-600">Częste pytania</a></li>
                <li><a href="/blog/" className="hover:text-primary-600">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Kontakt</h4>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li>kontakt@osrodek-myway.pl</li>
                <li>Tel. 731 395 295</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500">
            <p>© 2026 Ranking Ośrodków. Wszelkie prawa zastrzeżone.</p>
            <p className="mt-2 md:mt-0">
              Ranking ma charakter informacyjny. W sytuacjach zagrożenia życia dzwoń na 112.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;