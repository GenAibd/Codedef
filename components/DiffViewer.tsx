import React from 'react';
import { DiffPart } from '../types';

interface DiffViewerProps {
  diffs: DiffPart[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ diffs }) => {
  if (diffs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-700 rounded-lg bg-slate-800/50">
        <p>No differences calculated yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 font-mono text-sm">
      <div className="max-h-[500px] overflow-y-auto">
        {diffs.map((part, index) => {
          // Determine styles based on diff type
          let bgClass = 'bg-transparent';
          let textClass = 'text-slate-300';
          let symbol = ' ';

          if (part.added) {
            bgClass = 'bg-green-900/30';
            textClass = 'text-green-300';
            symbol = '+';
          } else if (part.removed) {
            bgClass = 'bg-red-900/30';
            textClass = 'text-red-300';
            symbol = '-';
          }

          // Handle multi-line strings in a single diff part
          // We split by newline to render line numbers or standard unified diff look
          const lines = part.value.split('\n');
          // If the last element is empty (due to trailing newline), remove it
          if (lines.length > 0 && lines[lines.length - 1] === '') {
            lines.pop();
          }

          return (
            <React.Fragment key={index}>
              {lines.map((line, lineIdx) => (
                <div key={`${index}-${lineIdx}`} className={`flex ${bgClass} ${textClass} px-2 py-0.5 min-h-[1.5rem]`}>
                  <span className="select-none w-6 text-right opacity-50 mr-4 font-bold">{symbol}</span>
                  <pre className="whitespace-pre-wrap break-all flex-1">{line}</pre>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
