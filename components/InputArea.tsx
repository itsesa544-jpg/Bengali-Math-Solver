import React, { useState, useRef, useEffect } from 'react';
import { InputTab } from '../types';
import { TextIcon, UploadIcon, CameraIcon, CloseIcon } from './Icons';
import CameraModal from './CameraModal';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  setInputImage: (file: File | null) => void;
  onSolve: () => void;
  isLoading: boolean;
}

const TabButton: React.FC<{ icon: React.ReactNode; label: string; name: InputTab; isActive: boolean; onClick: () => void }> = ({ icon, label, name, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
      isActive
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </button>
);

const ExampleButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 hover:text-slate-800 transition-colors">
        {children}
    </button>
);


const InputArea: React.FC<InputAreaProps> = ({ inputText, setInputText, setInputImage, onSolve, isLoading }) => {
  const [activeTab, setActiveTab] = useState<InputTab>(InputTab.Text);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear image when switching to text tab
    if (activeTab === InputTab.Text) {
      handleRemoveImage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleCameraCapture = (file: File) => {
      setInputImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsCameraOpen(false);
  }

  const handleRemoveImage = () => {
    setInputImage(null);
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleExampleClick = (text: string) => {
      setInputText(text);
      setActiveTab(InputTab.Text);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start border-b -mx-4 sm:-mx-6 px-2">
        <TabButton icon={<TextIcon className="w-5 h-5" />} label="লেখা" name={InputTab.Text} isActive={activeTab === InputTab.Text} onClick={() => setActiveTab(InputTab.Text)} />
        <TabButton icon={<UploadIcon className="w-5 h-5" />} label="ফাইল" name={InputTab.File} isActive={activeTab === InputTab.File} onClick={() => setActiveTab(InputTab.File)} />
        <TabButton icon={<CameraIcon className="w-5 h-5" />} label="ক্যামেরা" name={InputTab.Camera} isActive={activeTab === InputTab.Camera} onClick={() => setActiveTab(InputTab.Camera)} />
      </div>

      <div className="min-h-[120px]">
        {activeTab === InputTab.Text && (
          <div className="relative w-full">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="আপনার গণিতের প্রশ্নটি এখানে লিখুন, যেমন: x^2 - 5x + 6 = 0"
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32"
              disabled={isLoading}
            />
          </div>
        )}
        {(activeTab === InputTab.File || activeTab === InputTab.Camera) && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md" />
                <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-slate-900">
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTab === InputTab.File && (
                    <>
                        <p className="text-slate-500">আপনার প্রশ্নের একটি ছবি আপলোড করুন</p>
                        <button onClick={() => fileInputRef.current?.click()} className="font-semibold text-blue-600 hover:underline">ফাইল বাছাই করুন</button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </>
                )}
                {activeTab === InputTab.Camera && (
                     <>
                        <p className="text-slate-500">ক্যামেরা দিয়ে সরাসরি ছবি তুলুন</p>
                        <button onClick={() => setIsCameraOpen(true)} className="font-semibold text-blue-600 hover:underline">ক্যামেরা খুলুন</button>
                    </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onSolve}
        disabled={isLoading}
        className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-wait transition-colors flex items-center justify-center"
      >
        {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
        {isLoading ? 'সমাধান করা হচ্ছে...' : 'সমাধান করুন'}
      </button>

      <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-slate-600">কিছু উদাহরণ চেষ্টা করুন:</p>
          <div className="flex flex-wrap justify-center gap-2">
              <ExampleButton onClick={() => handleExampleClick('x^2 - 5x + 6 = 0')}>দ্বিঘাত সমীকরণ</ExampleButton>
              <ExampleButton onClick={() => handleExampleClick('2x + 5 = 15')}>সরল সমীকরণ</ExampleButton>
              <ExampleButton onClick={() => handleExampleClick('sin(90) + cos(0) = ?')}>ত্রিকোণমিতি</ExampleButton>
              <ExampleButton onClick={() => handleExampleClick('y = 2x + 1 এর গ্রাফ আঁক')}>ব্যবকলন</ExampleButton>
          </div>
      </div>
      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCameraCapture} />
    </div>
  );
};

export default InputArea;