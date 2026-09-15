
import { BibleResponse } from '../types';

export const fetchBibleVerse = async (
  book: string,
  chapter: number,
  verse: number,
  translation: string
): Promise<BibleResponse> => {
  const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}:${verse}?translation=${translation}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch verse: ${response.statusText}`);
  }
  return await response.json();
};

export const fetchBibleChapter = async (
  book: string,
  chapter: number,
  translation: string
): Promise<BibleResponse> => {
  const url = `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${translation}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch chapter: ${response.statusText}`);
  }
  return await response.json();
};
