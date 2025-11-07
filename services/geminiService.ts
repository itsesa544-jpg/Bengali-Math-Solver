import { GoogleGenAI, Modality } from "@google/genai";
import { OutputFormat } from "../types";

const getAiClient = () => {
    const apiKey = "AIzaSyBeYYq-ab1YGQNlELChU2YPaybUs_iFALc";
    return new GoogleGenAI({ apiKey });
};

const modelName = 'gemini-2.5-flash';
const imageModelName = 'gemini-2.5-flash-image';

export const GRAPH_KEYWORD = 'GRAPH_NEEDED';

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


export const solveMathProblem = async (
    promptParts: (string | { inlineData: { mimeType: string; data: string } })[],
    format: OutputFormat
): Promise<string> => {
    const ai = getAiClient();
    const modelParts = promptParts.map(part => {
        if (typeof part === 'string') {
            return { text: part };
        }
        return part;
    });

    const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts: modelParts },
        config: {
            systemInstruction: getSystemInstruction(format),
        },
    });

    return response.text;
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
    const ai = getAiClient();
    const fullPrompt = `Please generate a clear, simple, black and white line graph for the following mathematical equation or problem. The graph should be the primary focus, without any extra text or labels on the image itself. Problem: ${problemText}`;
    
    const response = await ai.models.generateContent({
        model: imageModelName,
        contents: {
            parts: [{ text: fullPrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("No image was generated for the graph.");
}

export const createImagePreview = (file: File, maxSize: number = 128): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error("FileReader failed to read file."));
            }
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};