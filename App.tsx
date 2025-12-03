import React, { useState } from 'react';
import { CodeInput } from './components/CodeInput';
import { DiffViewer } from './components/DiffViewer';
import { AnalysisPanel } from './components/AnalysisPanel';
import { computeLineDiff } from './utils/diffUtils';
import { analyzeCodeDifferences } from './services/geminiService';
import { DiffPart, AnalysisResult } from './types';
import { GitCompare, Sparkles, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [originalCode, setOriginalCode] = useState<string>('');
  const [modifiedCode, setModifiedCode] = useState<string>('');
  const [diffResult, setDiffResult] = useState<DiffPart[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasCompared, setHasCompared] = useState<boolean>(false);

  const handleCompare = async () => {
    if (!originalCode && !modifiedCode) return;

    // 1. Calculate Visual Diff (Local)
    const diffs = computeLineDiff(originalCode, modifiedCode);
    setDiffResult(diffs);
    setHasCompared(true);

    // 2. AI Analysis (Remote)
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const analysis = await analyzeCodeDifferences(originalCode, modifiedCode);
      setAiAnalysis(analysis);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setOriginalCode('');
    setModifiedCode('');
    setDiffResult([]);
    setAiAnalysis(null);
    setHasCompared(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
              <GitCompare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              CodeDiff AI
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Input Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
          <CodeInput
            label="Original Code (Paste Here)"
            value={originalCode}
            onChange={setOriginalCode}
            placeholder="// Paste original code..."
            className="h-full"
          />
          <CodeInput
            label="Modified Code (Paste Here)"
            value={modifiedCode}
            onChange={setModifiedCode}
            placeholder="// Paste modified code..."
            className="h-full"
          />
        </section>

        {/* Action Bar */}
        <div className="flex justify-center gap-4 sticky top-20 z-40 bg-slate-950/80 p-2 backdrop-blur-sm rounded-xl border border-slate-800/50 w-fit mx-auto">
          <button
            onClick={handleCompare}
            disabled={isAnalyzing || (!originalCode && !modifiedCode)}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all shadow-lg
              ${isAnalyzing || (!originalCode && !modifiedCode)
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-0.5'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Compare & Analyze
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Results Section */}
        {hasCompared && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Visual Diff Column */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                Visual Differences
              </h2>
              <DiffViewer diffs={diffResult} />
            </div>

            {/* AI Analysis Column */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                Gemini Insights
              </h2>
              <AnalysisPanel analysis={aiAnalysis} isLoading={isAnalyzing} />
            </div>

          </section>
        )}
      </main>
    </div>
  );
};

export default App;
