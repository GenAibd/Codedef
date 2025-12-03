import React from 'react';
import { AnalysisResult } from '../types';
import { AlertCircle, CheckCircle, BrainCircuit } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/50 animate-pulse h-full flex flex-col gap-4">
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-4/6"></div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900 flex flex-col h-full">
      <div className="p-4 bg-indigo-900/20 border-b border-slate-700 flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-indigo-100">AI Change Analysis</h3>
      </div>
      
      <div className="p-6 space-y-6 overflow-y-auto max-h-[500px]">
        {/* Summary */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Summary</h4>
          <p className="text-slate-200 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Key Changes */}
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
             Changes Detected
          </h4>
          <ul className="space-y-2">
            {analysis.keyChanges.map((change, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Issues */}
        {analysis.potentialIssues.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
              Potential Issues
            </h4>
            <ul className="space-y-2">
              {analysis.potentialIssues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-amber-200 bg-amber-900/20 p-2 rounded-md border border-amber-900/50">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                  <span className="text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
