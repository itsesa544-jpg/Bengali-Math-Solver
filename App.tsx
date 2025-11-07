
import React, { useState, useCallback } from 'react';
import { solveMathProblem, fileToBase64, generateGraphFromText, GRAPH_KEYWORD, createImagePreview } from './services/geminiService';
import { Solution, OutputFormat, HistoryItem } from './types';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';
import HistorySidebar from './components/HistorySidebar';
import HistoryDetail from './components/HistoryDetail';

// A custom hook to work with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting value to localStorage', error);
        }
    };

    return [storedValue, setValue];
}


const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [solution, setSolution] = useState<Solution>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.Detailed);
  const [error, setError] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('math-solver-history', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);


  const handleSolve = useCallback(async () => {
    if (!inputText.trim() && !inputImage) {
      setError('অনুগ্রহ করে একটি প্রশ্ন লিখুন অথবা ছবি আপলোড করুন।');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution(null);
    setSelectedHistoryItem(null);

    const promptParts: (string | { inlineData: { mimeType: string; data: string } })[] = [];
    let problemDescription = inputText;

    if (inputText) {
      promptParts.push(inputText);
    }
    if (inputImage) {
      try {
        const { mimeType, data } = await fileToBase64(inputImage);
        promptParts.push({ inlineData: { mimeType, data } });
        if (!problemDescription) {
            problemDescription = "the problem in the image";
        }
      } catch (e) {
        setError('ছবি প্রসেস করা সম্ভব হয়নি।');
        setIsLoading(false);
        return;
      }
    }

    try {
      let finalSolution: Solution = null;
      const resultText = await solveMathProblem(promptParts, outputFormat);

      if (resultText.trim().endsWith(GRAPH_KEYWORD)) {
        const cleanedText = resultText.replace(GRAPH_KEYWORD, '').trim();
        setSolution(cleanedText); // Show text solution first
        try {
            const graphImage = await generateGraphFromText(problemDescription);
            finalSolution = {
                isGraph: true,
                explanation: cleanedText,
                graphImage: graphImage,
            };
            setSolution(finalSolution);
        } catch (graphError) {
            console.error("Graph generation failed:", graphError);
            finalSolution = cleanedText + "\n\n*(দুঃখিত, গ্রাফ তৈরি করা সম্ভব হয়নি।)*";
            setSolution(finalSolution);
        }
      } else {
        finalSolution = resultText;
        setSolution(finalSolution);
      }

      // Add to history
      let imagePreview: string | undefined = undefined;
      if (inputImage) {
          try {
              imagePreview = await createImagePreview(inputImage);
          } catch(e) {
              console.error("Failed to create image preview for history:", e);
          }
      }

      const historyItem: HistoryItem = {
          id: `${Date.now()}-${Math.random()}`,
          problemInput: inputText,
          imagePreview: imagePreview,
          solution: finalSolution,
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep history limited to 50 items

    } catch (err) {
      console.error(err);
      setError('সমাধান তৈরি করতে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, inputImage, outputFormat, setHistory]);

  const handleClearHistory = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত হিস্টোরি মুছে ফেলতে চান?')) {
        setHistory([]);
        setIsHistoryOpen(false);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-slate-100 text-slate-800 font-sans flex flex-col p-4">
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />
      <main className="flex-grow container mx-auto max-w-3xl flex flex-col">
        {selectedHistoryItem ? (
            <div className="mt-4">
                <HistoryDetail item={selectedHistoryItem} onBack={() => setSelectedHistoryItem(null)} />
            </div>
        ) : (
            <>
                <div className="bg-blue-50/50 rounded-xl shadow-lg border border-slate-200/80 p-1.5 mt-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6">
                        <InputArea
                          inputText={inputText}
                          setInputText={setInputText}
                          setInputImage={setInputImage}
                          onSolve={handleSolve}
                          isLoading={isLoading}
                        />
                    </div>
                </div>
                
                {error && <div className="mt-6 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

                <OutputArea
                  solution={solution}
                  isLoading={isLoading}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat}
                />
            </>
        )}
      </main>
      <Footer onBrandClick={() => setIsAboutModalOpen(true)} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onItemClick={(item) => {
            setSelectedHistoryItem(item);
            setIsHistoryOpen(false);
        }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default App;
