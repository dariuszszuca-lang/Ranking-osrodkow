import React from 'react';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Abstract Background Elements — subtle, no animation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold mb-8 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50">
            <Sparkles size={16} className="text-gold-500" />
            <span className="uppercase tracking-wide text-xs sm:text-sm">Edycja 2026</span>
          </div>
        </div>
        
        <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-8" style={{ animationDelay: '0.2s' }}>
          Ranking Ośrodków <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 dark:from-primary-400 dark:via-primary-200 dark:to-primary-400 filter drop-shadow-sm">
              Terapii Uzależnień
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary-500/20 dark:bg-primary-500/30 blur-lg rounded-full"></div>
          </span>
        </h1>
        
        <p className="animate-fade-in-up max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Szukasz ośrodka <span className="text-slate-900 dark:text-white font-semibold">dla siebie</span> lub <span className="text-slate-900 dark:text-white font-semibold">bliskiej osoby</span>? Sprawdziliśmy najlepsze prywatne placówki w Polsce — żebyś <span className="text-slate-900 dark:text-white font-semibold">nie musiał szukać po omacku</span>.
        </p>

        <div className="animate-fade-in-up flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-100 dark:border-slate-800 shadow-sm">
            <ShieldCheck className="text-gold-500" size={20} />
            <span>Audyt Kliniczny 2026</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-100 dark:border-slate-800 shadow-sm">
            <Award className="text-gold-500" size={20} />
            <span>Niezależna Komisja</span>
          </div>
        </div>

        <div className="animate-fade-in-up mt-10" style={{ animationDelay: '0.5s' }}>
          <a href="tel:731395295" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-600 dark:text-gold-400 font-semibold hover:bg-gold-500/20 transition-all text-base">
            <span>Potrzebujesz pomocy? Zadzwoń</span>
            <span className="font-bold text-white">731 395 295</span>
          </a>
        </div>
      </div>
    </div>
  );
};