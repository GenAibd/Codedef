export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

export enum DiffType {
  CHARS = 'CHARS',
  WORDS = 'WORDS',
  LINES = 'LINES',
  JSON = 'JSON',
}

export interface AnalysisResult {
  summary: string;
  keyChanges: string[];
  potentialIssues: string[];
}
