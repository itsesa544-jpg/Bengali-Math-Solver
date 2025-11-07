import React, { useRef, useState } from 'react';
import { Solution, OutputFormat } from '../types';
import { DownloadIcon, ShareIcon } from './Icons';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface OutputAreaProps {
  solution: Solution;
  isLoading: boolean;
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
}

const FormatTab: React.FC<{ label: string; name: OutputFormat; isActive: boolean; onClick: () => void }> = ({ label, name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
      isActive
        ? 'bg-white text-slate-800 shadow-sm'
        : 'bg-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {label}
  </button>
);

const OutputArea: React.FC<OutputAreaProps> = ({ solution, isLoading, outputFormat, setOutputFormat }) => {
  const solutionContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'copied'>('idle');

  const handleDownloadPdf = async () => {
    if (!solutionContainerRef.current || !window.jspdf || !window.html2canvas) {
        alert('PDF generation library is not loaded yet.');
        return;
    }
    
    setIsDownloading(true);
    try {
        const canvas = await window.html2canvas(solutionContainerRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pdfWidth - 20; // with 10mm margin on each side
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;
        const imgHeight = contentWidth / aspectRatio;

        pdf.addImage(imgData, 'PNG', 10, 10, contentWidth, imgHeight);
        pdf.save(`samadhan-solution.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    } finally {
        setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!solution) return;
    setShareStatus('sharing');

    const solutionText = (typeof solution === 'string' 
        ? solution.replace(/<[^>]*>/g, '\n').replace(/\n\n+/g, '\n') // strip html tags and clean newlines
        : solution?.explanation || ''
    ).trim();
    
    const shareData = {
        title: 'গণিত সমাধান',
        text: `সমস্যাটির সমাধান নিচে দেওয়া হলো:\n\n${solutionText}`,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Sharing was cancelled or failed:', error);
        } finally {
            setShareStatus('idle');
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareData.text);
            setShareStatus('copied');
            setTimeout(() => setShareStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert("আপনার ব্রাউজার শেয়ার সমর্থন করে না। ক্লিপবোর্ডে কপি করা সম্ভব হয়নি।");
            setShareStatus('idle');
        }
    }
};

  const renderSolution = () => {
    if (typeof solution === 'string') {
      return <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, '<br />') }} />;
    }
    if (solution?.isGraph) {
      return (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none text-slate-800" dangerouslySetInnerHTML={{ __html: solution.explanation.replace(/\n/g, '<br />') }} />
          <div className="mt-4 border-t pt-4">
            <h4 className="text-base font-semibold text-slate-700 mb-2">গ্রাফ:</h4>
            <img src={solution.graphImage} alt="Generated graph of the solution" className="w-full h-auto rounded-lg border bg-white" />
          </div>
        </div>
      );
    }
    return <p className="text-slate-500 text-center py-8">আপনার সমাধান এখানে দেখানো হবে।</p>;
  };

  return (
    <div className="mt-6">
       <div className="bg-blue-50/50 rounded-xl shadow-lg border border-slate-200/80 p-1.5">
            <div className="bg-white rounded-lg p-4 sm:p-6">
                <header className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">সমাধান</h2>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                    <FormatTab label="বিস্তারিত" name={OutputFormat.Detailed} isActive={outputFormat === OutputFormat.Detailed} onClick={() => setOutputFormat(OutputFormat.Detailed)} />
                    <FormatTab label="সংক্ষিপ্ত" name={OutputFormat.Brief} isActive={outputFormat === OutputFormat.Brief} onClick={() => setOutputFormat(OutputFormat.Brief)} />
                    </div>
                </header>
                <div ref={solutionContainerRef} className="mt-4 min-h-[100px] p-2 -m-2">
                    {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="flex items-center space-x-2 text-slate-500">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>লোড হচ্ছে...</span>
                        </div>
                    </div>
                    ) : (
                    renderSolution()
                    )}
                </div>

                {solution && !isLoading && (
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                        <button
                          onClick={handleShare}
                          disabled={shareStatus !== 'idle'}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            <ShareIcon className="h-4 w-4 mr-2" />
                            {shareStatus === 'copied' ? 'কপি হয়েছে!' : 'শেয়ার'}
                        </button>
                        <button
                          onClick={handleDownloadPdf}
                          disabled={isDownloading}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
                        >
                            {isDownloading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <DownloadIcon className="h-4 w-4 mr-2" />
                            )}
                            {isDownloading ? 'ডাউনলোড হচ্ছে...' : 'PDF ডাউনলোড'}
                        </button>
                    </div>
                )}

            </div>
       </div>
    </div>
  );
};

export default OutputArea;