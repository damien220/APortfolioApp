import type { ThemeColors } from '../state/schema';

export function applyThemeVars(colors: ThemeColors): Record<string, string> {
  return colors as unknown as Record<string, string>;
}

export function getPreferredColorScheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
