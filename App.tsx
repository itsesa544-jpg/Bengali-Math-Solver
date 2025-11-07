import React, { useState, useCallback } from 'react';
import { solveMathProblem, fileToBase64, generateGraphFromText, GRAPH_KEYWORD } from './services/geminiService';
import { Solution, OutputFormat } from './types';
import Header from './components/Header';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [solution, setSolution] = useState<Solution>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.Detailed);
  const [error, setError] = useState<string | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const handleSolve = useCallback(async () => {
    if (!inputText.trim() && !inputImage) {
      setError('অনুগ্রহ করে একটি প্রশ্ন লিখুন অথবা ছবি আপলোড করুন।');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSolution(null);

    const promptParts: (string | { inlineData: { mimeType: string; data: string } })[] = [];
    let problemDescription = inputText;

    // Order matters: text first, then image.
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
      const resultText = await solveMathProblem(promptParts, outputFormat);

      if (resultText.trim().endsWith(GRAPH_KEYWORD)) {
        const cleanedText = resultText.replace(GRAPH_KEYWORD, '').trim();
        // Show text solution first
        setSolution(cleanedText);
        // Then generate and add graph
        try {
            const graphImage = await generateGraphFromText(problemDescription);
            setSolution({
                isGraph: true,
                explanation: cleanedText,
                graphImage: graphImage,
            });
        } catch (graphError) {
            console.error("Graph generation failed:", graphError);
            // If graph fails, keep the text solution but add a warning
            setSolution(cleanedText + "\n\n*(দুঃখিত, গ্রাফ তৈরি করা সম্ভব হয়নি।)*");
        }
      } else {
        setSolution(resultText);
      }
    } catch (err) {
      console.error(err);
      setError('সমাধান তৈরি করতে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, inputImage, outputFormat]);

  return (
    <div className="min-h-screen w-screen bg-slate-100 text-slate-800 font-sans flex flex-col p-4">
      <Header />
      <main className="flex-grow container mx-auto max-w-3xl flex flex-col">
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
      </main>
      <Footer onBrandClick={() => setIsAboutModalOpen(true)} />
      {isAboutModalOpen && <AboutModal onClose={() => setIsAboutModalOpen(false)} />}
    </div>
  );
};

export default App;
