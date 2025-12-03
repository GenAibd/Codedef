import * as Diff from 'diff';
import { DiffPart } from '../types';

/**
 * Computes the difference between two text blocks line by line.
 */
export const computeLineDiff = (oldText: string, newText: string): DiffPart[] => {
  if (!oldText && !newText) return [];
  // Using the diff library to compute line differences
  return Diff.diffLines(oldText, newText, { newlineIsToken: false });
};

/**
 * Computes the difference based on words (good for inline changes).
 */
export const computeWordDiff = (oldText: string, newText: string): DiffPart[] => {
   if (!oldText && !newText) return [];
  return Diff.diffWords(oldText, newText);
};
