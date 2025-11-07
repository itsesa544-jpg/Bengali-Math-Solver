
import React, { useRef, useState } from 'react';
import { HistoryItem } from '../types';
import { ArrowLeftIcon, DownloadIcon, ShareIcon } from './Icons';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface HistoryDetailProps {
  item: HistoryItem;
  onBack: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ item, onBack }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const solutionText = (typeof item.solution === 'string'
      ? item.solution.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n')
      : item.solution.explanation
    ).trim();

    const shareData = {
        title: 'গণিত সমাধান হিস্টোরি',
        text: `সমস্যা: ${item.problemInput}\n\nসমাধান:\n${solutionText}`,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Sharing was cancelled or failed:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareData.text);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        } catch (err) {
            alert("আপনার ব্রাউজার শেয়ার সমর্থন করে না। ক্লিপবোর্ডে কপি করা সম্ভব হয়নি।");
        }
    }
  };

  const handleDownloadPdf = async () => {
    if (!downloadContainerRef.current || !window.jspdf || !window.html2canvas) {
        alert('PDF generation library is not loaded yet.');
        return;
    }
    
    setIsGeneratingPdf(true);
    try {
        const canvas = await window.html2canvas(downloadContainerRef.current, {
            scale: 2,
            backgroundColor: '#f8fafc', // Same as bg-slate-50
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pdfWidth - margin * 2;
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;
        const imgHeight = contentWidth / aspectRatio;

        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
        heightLeft -= (pdfHeight - margin * 2);

        while (heightLeft > 0) {
            position = -heightLeft - margin;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
            heightLeft -= (pdfHeight - margin * 2);
        }

        pdf.save(`samadhan-history-${item.id}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-6">
      <header className="flex items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium p-2 -ml-2 rounded-md"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          ফিরে যান
        </button>
        <h2 className="text-lg font-bold text-slate-800 text-center flex-1 whitespace-nowrap">হিস্টোরি ডিটেইলস</h2>
        <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              disabled={shareStatus !== 'idle'}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              aria-label="Share Solution"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              {shareStatus === 'copied' ? 'কপি হয়েছে!' : 'শেয়ার'}
            </button>
            <button 
              onClick={handleDownloadPdf} 
              disabled={isGeneratingPdf}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
              aria-label="Download as PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ডাউনলোড হচ্ছে...
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  PDF ডাউনলোড
                </>
              )}
            </button>
        </div>
      </header>

      <div ref={downloadContainerRef} className="p-4 bg-slate-50 rounded-lg">
        <section className="mb-6">
          <h3 className="text-md font-semibold text-slate-600 mb-2 border-b pb-1">সমস্যা:</h3>
          {item.imagePreview ? (
            <img src={item.imagePreview} alt="Problem" className="max-w-full h-auto rounded-md border" />
          ) : (
            <p className="text-slate-800 font-mono bg-white p-3 rounded-md border">{item.problemInput}</p>
          )}
        </section>

        <section>
          <h3 className="text-md font-semibold text-slate-600 mb-2 border-b pb-1">সমাধান:</h3>
          {typeof item.solution === 'string' ? (
            <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: item.solution.replace(/\n/g, '<br />') }} />
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: item.solution.explanation.replace(/\n/g, '<br />') }} />
              <div className="mt-4 border-t pt-4">
                <h4 className="text-base font-semibold text-slate-700 mb-2">গ্রাফ:</h4>
                <img src={item.solution.graphImage} alt="Generated graph of the solution" className="w-full h-auto rounded-lg border bg-white" />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HistoryDetail;