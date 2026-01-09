import { WordPair } from '../types';
import { DEFAULT_WORDS, STORAGE_KEY } from '../constants';

export const getStoredWords = (): WordPair[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with defaults if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WORDS));
    return DEFAULT_WORDS;
  } catch (e) {
    console.error("Error reading storage", e);
    return DEFAULT_WORDS;
  }
};

export const saveWordPair = (pair: WordPair): WordPair[] => {
  const words = getStoredWords();
  const updated = [...words, pair];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateWordPair = (pair: WordPair): WordPair[] => {
  const words = getStoredWords();
  const updated = words.map(w => w.id === pair.id ? pair : w);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteWordPair = (id: string): WordPair[] => {
  const words = getStoredWords();
  const updated = words.filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
