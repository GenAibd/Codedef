import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const analyzeCodeDifferences = async (
  originalCode: string,
  modifiedCode: string
): Promise<AnalysisResult> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const prompt = `
    You are a senior software engineer conducting a code review.
    Compare the following two code snippets (Original vs Modified).
    
    1. Provide a brief summary of the changes.
    2. List the specific key technical changes (e.g., "Refactored loop to map", "Fixed typo in variable").
    3. Identify potential issues, bugs, or performance concerns introduced by the changes (if any).
    
    Return the response in JSON format matching the specified schema.

    --- ORIGINAL CODE ---
    ${originalCode}
    
    --- MODIFIED CODE ---
    ${modifiedCode}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyChanges: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            potentialIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ["summary", "keyChanges", "potentialIssues"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing code with Gemini:", error);
    return {
      summary: "Failed to analyze code differences.",
      keyChanges: [],
      potentialIssues: ["API Error or invalid response format."],
    };
  }
};
