import React from 'react';
import { Center } from '../types';
import { MapPin, Star, CheckCircle2, Trophy, ArrowRight, Quote, ThumbsUp } from 'lucide-react';

interface Props {
  center: Center;
}

export const RankingCard: React.FC<Props> = ({ center }) => {
  const isWinner = center.rank === 1;

  return (
    <div className={`
      relative group rounded-3xl transition-all duration-500 animate-fade-in-up
      ${isWinner 
        ? 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl premium-glow ring-1 ring-gold-400/30 dark:ring-gold-500/20 z-10 transform md:-translate-y-2' 
        : 'bg-white dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl'}
    `}>
      
      {/* Winner Special Effects */}
      {isWinner && (
        <>
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-400 to-gold-600 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20 whitespace-nowrap tracking-wider uppercase">
            <Trophy size={16} className="text-yellow-100" />
            Lider Rankingu 2026
          </div>
        </>
      )}

      {/* Rank Badge */}
      <div className={`
        absolute top-0 left-0 sm:left-6 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl font-black text-2xl sm:text-3xl shadow-lg z-20 rotate-3 group-hover:rotate-0 transition-transform duration-300
        ${isWinner 
          ? 'bg-gradient-to-br from-gold-300 to-gold-600 text-white shadow-gold-500/30 ring-4 ring-white dark:ring-slate-900' 
          : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm'}
      `}>
        #{center.rank}
      </div>

      <div className="p-6 sm:p-8 pt-10 sm:pt-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1 pl-2 sm:pl-16">
            <h3 className={`text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${isWinner ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
              {center.name}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                <MapPin size={14} />
                {center.location}
              </div>
              <div className="flex items-center gap-1.5 text-gold-500 font-bold bg-gold-50 dark:bg-yellow-900/10 px-3 py-1 rounded-full">
                <Star className="fill-gold-500" size={14} />
                {center.reviews.rating} <span className="font-normal text-slate-400">({center.reviews.count})</span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-medium px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {center.priceRange}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end pl-2 sm:pl-0">
            {center.tags.map((tag, i) => (
              <span key={tag} className={`
                text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide
                ${isWinner 
                  ? 'bg-gold-50 text-gold-700 border border-gold-200 dark:bg-gold-900/20 dark:text-gold-300 dark:border-gold-800/50' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
              `}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
          
          {/* Main Description & Verdict */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Quote size={14} /> Werdykt Eksperta
              </h4>
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
                "{center.expertVerdict}"
              </p>
            </div>
            
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {center.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {center.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className={`w-4 h-4 ${isWinner ? 'text-gold-500' : 'text-primary-500'}`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros Column */}
          <div className={`
            rounded-2xl p-6 flex flex-col justify-between
            ${isWinner ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-slate-50 dark:bg-slate-800/30'}
          `}>
            <div>
              <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
                <ThumbsUp size={18} className="text-green-500" />
                Mocne strony
              </h4>
              <ul className="space-y-3">
                {center.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-green-500 shrink-0"></span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <a 
                href={center.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className={`
                  group/btn w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-md transform active:scale-95
                  ${isWinner 
                    ? 'bg-gradient-to-r from-gold-500 to-yellow-600 hover:from-gold-400 hover:to-yellow-500 text-white shadow-gold-500/25 ring-2 ring-transparent hover:ring-gold-300' 
                    : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'}
                `}
              >
                <span>Sprawdź dostępność</span>
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
              </a>
              {isWinner && (
                <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                  Najczęściej wybierany ośrodek w tym miesiącu
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};