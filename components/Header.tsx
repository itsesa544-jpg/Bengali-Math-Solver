import React from 'react';
import { HistoryIcon } from './Icons';

interface HeaderProps {
    onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-transparent pt-2 pb-0">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-between gap-3">
            <div className="w-10"></div> {/* Spacer to balance the history button */}
            <h1 className="text-2xl font-bold text-slate-700 text-center flex items-center justify-center gap-2">
              <span className="text-3xl">🧐</span>
              <span>গণিত সমাধান AI</span>
            </h1>
            <button 
                onClick={onHistoryClick}
                className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="View history"
            >
                <HistoryIcon className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;