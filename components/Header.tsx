import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Ranking Ośrodków
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#ranking" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Ranking Ośrodków
          </a>
<a href="/blog/" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Blog
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};