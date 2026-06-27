import { MoodResult } from "@/types";

const HISTORY_KEY = "moodsmith-history";

/**
 * Retrieves the history of mood generation results from localStorage.
 * Returns an empty array if no history exists or during SSR.
 */
export function getHistory(): MoodResult[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as MoodResult[];
  } catch (error) {
    console.error("Failed to read history from localStorage:", error);
    return [];
  }
}

/**
 * Saves a new mood generation result to the top of the history list in localStorage.
 * Deduplicates by ID, shifts to the front, and caps the total items at 20.
 */
export function saveToHistory(result: MoodResult): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    // Exclude the current item if it already exists to avoid duplication
    const filtered = history.filter((item) => item.id !== result.id);
    
    // Put the newest item at the front of the list
    const updated = [result, ...filtered];
    
    // Keep only the latest 20 items
    const sliced = updated.slice(0, 20);
    
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(sliced));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
}

/**
 * Deletes a mood generation result from the history list by its ID.
 */
export function deleteFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete history item from localStorage:", error);
  }
}
