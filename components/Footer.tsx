
import React from 'react';

interface FooterProps {
  onBrandClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBrandClick }) => {
  return (
    <footer className="py-6">
      <div className="container mx-auto max-w-4xl text-center">
        <button onClick={onBrandClick} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
          Powered by IM Softwark
        </button>
      </div>
    </footer>
  );
};

export default Footer;
