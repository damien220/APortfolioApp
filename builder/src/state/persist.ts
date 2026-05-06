import { PortfolioStateSchema, type PortfolioState } from './schema';

const STORAGE_KEY = 'aportfolio-builder-state';

export function saveToStorage(state: PortfolioState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export function loadFromStorage(): PortfolioState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const result = PortfolioStateSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function exportStateJson(state: PortfolioState): string {
  return JSON.stringify(state, null, 2);
}
