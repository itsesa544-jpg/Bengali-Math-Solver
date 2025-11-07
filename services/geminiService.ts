import { Modality } from "@google/genai";
import { OutputFormat } from "../types";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';
const imageModelName = 'gemini-2.5-flash-image';

export const GRAPH_KEYWORD = 'GRAPH_NEEDED';

// This function is kept for context but is not used by the mock service
const getSystemInstruction = (format: OutputFormat): string => {
  const detailLevel = format === OutputFormat.Detailed
    ? 'Provide a step-by-step detailed solution.'
    : 'Provide a brief, direct answer.';
  
  return `You are an expert math tutor. Your responses must be in clear, easy-to-understand Bengali.
${detailLevel}
Use Markdown for formatting equations and steps where appropriate.
If the user's request specifically asks to draw a graph (using words like "গ্রাফ আঁক", "draw a graph", "plot"), you MUST append the special keyword "${GRAPH_KEYWORD}" at the very end of your response, on a new line.
Provide the textual explanation and solution as usual. For example, explain the slope and y-intercept for a line graph. Then, add the keyword.`;
};

// --- MOCKED API FUNCTIONS FOR DEMO ---

const demoSolutions = {
    detailed: `**সমস্যা:** x² - 5x + 6 = 0 সমীকরণটির সমাধান কর।

**সমাধান:**

এটি একটি দ্বিঘাত সমীকরণ। আমরা এটিকে মধ্যপদ বিশ্লেষণের (middle-term factorization) মাধ্যমে সমাধান করতে পারি।

1.  **ধাপ ১:** প্রথমে, আমরা এমন দুটি সংখ্যা খুঁজব যাদের গুণফল 6 (ধ্রুবক পদ) এবং যোগফল -5 (x-এর সহগ)। সংখ্যা দুটি হলো -2 এবং -3।
    *   (-2) * (-3) = 6
    *   (-2) + (-3) = -5

2.  **ধাপ ২:** এখন, আমরা মধ্যপদ -5x কে -2x এবং -3x দিয়ে প্রতিস্থাপন করব।
    x² - 2x - 3x + 6 = 0

3.  **ধাপ ৩:** প্রথম দুটি পদ থেকে x এবং শেষ দুটি পদ থেকে -3 কমন নেব।
    x(x - 2) - 3(x - 2) = 0

4.  **ধাপ ৪:** এখন, (x - 2) কমন নেব।
    (x - 2)(x - 3) = 0

5.  **ধাপ ৫:** দুটি রাশির গুণফল শূন্য হলে, তাদের যেকোনো একটি অবশ্যই শূন্য হবে।
    *   হয়, x - 2 = 0 => x = 2
    *   অথবা, x - 3 = 0 => x = 3

**সুতরাং, নির্ণেয় সমাধান:** x = 2, 3`,
    brief: `x = 2, 3`,
    graph: `**সমস্যা:** y = 2x + 1 এর গ্রাফ আঁক।

**সমাধান:**

এটি একটি সরলরেখার সমীকরণ, যেখানে:
*   **ঢাল (m):** 2
*   **y-অক্ষ ছেদক (c):** 1

গ্রাফটি y-অক্ষকে (0, 1) বিন্দুতে ছেদ করে এবং এর ঢাল ধনাত্মক হওয়ায় এটি ঊর্ধ্বগামী হবে।
${GRAPH_KEYWORD}`
};

const demoGraphBase64 = "data:image/png;base64,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";

export const solveMathProblem = async (
    promptParts: (string | { inlineData: { mimeType: string; data: string } })[],
    format: OutputFormat
): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const problem = promptParts.find(p => typeof p === 'string') as string || '';
            if (problem.includes('গ্রাফ')) {
                 resolve(demoSolutions.graph);
            } else if (format === OutputFormat.Detailed) {
                resolve(demoSolutions.detailed);
            } else {
                resolve(demoSolutions.brief);
            }
        }, 1500);
    });
};

export const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateGraphFromText = async (problemText: string): Promise<string> => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(demoGraphBase64);
        }, 2000);
    });
}