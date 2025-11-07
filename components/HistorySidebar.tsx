
import React from 'react';
import { HistoryItem } from '../types';
import { CloseIcon } from './Icons';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onItemClick, onClearHistory }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-700">History</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
              <CloseIcon className="h-6 w-6" />
            </button>
          </header>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-slate-500 pt-10">
                <p>No history yet.</p>
                <p className="text-sm">Solve a problem to see it here.</p>
              </div>
            ) : (
              history.map(item => {
                const solutionText = typeof item.solution === 'string'
                  ? item.solution
                  : item.solution.explanation;

                return (
                  <button 
                    key={item.id} 
                    onClick={() => onItemClick(item)}
                    className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                  >
                    <div className="flex items-start gap-3">
                      {item.imagePreview ? (
                        <img src={item.imagePreview} alt="Problem preview" className="w-12 h-12 object-cover rounded-md flex-shrink-0 bg-slate-200" />
                      ) : (
                         <div className="w-12 h-12 flex-shrink-0 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center font-mono text-xl">
                           T
                         </div>
                      )}
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.problemInput}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{solutionText}</p>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
          
          {history.length > 0 && (
            <footer className="p-4 border-t">
              <button
                onClick={onClearHistory}
                className="w-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors px-4 py-2.5 rounded-lg"
              >
                Clear History
              </button>
            </footer>
          )}
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;