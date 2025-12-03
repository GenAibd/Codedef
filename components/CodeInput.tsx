import React from 'react';

interface CodeInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <label className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex-grow relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 focus-within:border-blue-500 transition-colors">
        <textarea
          className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-sm resize-none focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
