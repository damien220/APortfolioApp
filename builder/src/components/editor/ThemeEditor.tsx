import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { usePortfolioStore } from '../../state/store';
import type { ThemeColors } from '../../state/schema';
import './ThemeEditor.css';

type ColorVar = keyof ThemeColors;

const COLOR_VARS: ColorVar[] = [
  '--color-bg',
  '--color-bg-secondary',
  '--color-text',
  '--color-text-secondary',
  '--color-accent',
  '--color-accent-hover',
  '--color-border',
  '--color-card-bg',
  '--color-card-shadow',
  '--color-tag-bg',
  '--color-tag-text',
  '--color-filter-active-bg',
  '--color-filter-active-text',
];

const PRESETS: Record<string, { light: ThemeColors; dark: ThemeColors }> = {
  Indigo: {
    light: { '--color-bg': '#fafafa', '--color-bg-secondary': '#ffffff', '--color-text': '#1a1a2e', '--color-text-secondary': '#4a4a6a', '--color-accent': '#6366f1', '--color-accent-hover': '#4f46e5', '--color-border': '#e2e8f0', '--color-card-bg': '#ffffff', '--color-card-shadow': 'rgba(0,0,0,0.08)', '--color-tag-bg': '#eef2ff', '--color-tag-text': '#4338ca', '--color-filter-active-bg': '#6366f1', '--color-filter-active-text': '#ffffff' },
    dark: { '--color-bg': '#0f0f1a', '--color-bg-secondary': '#1a1a2e', '--color-text': '#e2e8f0', '--color-text-secondary': '#94a3b8', '--color-accent': '#818cf8', '--color-accent-hover': '#a5b4fc', '--color-border': '#2d2d44', '--color-card-bg': '#1a1a2e', '--color-card-shadow': 'rgba(0,0,0,0.3)', '--color-tag-bg': '#2d2d54', '--color-tag-text': '#a5b4fc', '--color-filter-active-bg': '#818cf8', '--color-filter-active-text': '#0f0f1a' },
  },
  Emerald: {
    light: { '--color-bg': '#f0fdf4', '--color-bg-secondary': '#ffffff', '--color-text': '#14532d', '--color-text-secondary': '#166534', '--color-accent': '#10b981', '--color-accent-hover': '#059669', '--color-border': '#bbf7d0', '--color-card-bg': '#ffffff', '--color-card-shadow': 'rgba(0,0,0,0.06)', '--color-tag-bg': '#d1fae5', '--color-tag-text': '#065f46', '--color-filter-active-bg': '#10b981', '--color-filter-active-text': '#ffffff' },
    dark: { '--color-bg': '#022c22', '--color-bg-secondary': '#064e3b', '--color-text': '#d1fae5', '--color-text-secondary': '#6ee7b7', '--color-accent': '#34d399', '--color-accent-hover': '#6ee7b7', '--color-border': '#065f46', '--color-card-bg': '#064e3b', '--color-card-shadow': 'rgba(0,0,0,0.3)', '--color-tag-bg': '#065f46', '--color-tag-text': '#6ee7b7', '--color-filter-active-bg': '#34d399', '--color-filter-active-text': '#022c22' },
  },
  Rose: {
    light: { '--color-bg': '#fff1f2', '--color-bg-secondary': '#ffffff', '--color-text': '#881337', '--color-text-secondary': '#9f1239', '--color-accent': '#f43f5e', '--color-accent-hover': '#e11d48', '--color-border': '#fecdd3', '--color-card-bg': '#ffffff', '--color-card-shadow': 'rgba(0,0,0,0.06)', '--color-tag-bg': '#ffe4e6', '--color-tag-text': '#9f1239', '--color-filter-active-bg': '#f43f5e', '--color-filter-active-text': '#ffffff' },
    dark: { '--color-bg': '#1c0a0e', '--color-bg-secondary': '#3b0019', '--color-text': '#fecdd3', '--color-text-secondary': '#fda4af', '--color-accent': '#fb7185', '--color-accent-hover': '#fda4af', '--color-border': '#4c0519', '--color-card-bg': '#3b0019', '--color-card-shadow': 'rgba(0,0,0,0.3)', '--color-tag-bg': '#4c0519', '--color-tag-text': '#fda4af', '--color-filter-active-bg': '#fb7185', '--color-filter-active-text': '#1c0a0e' },
  },
  Amber: {
    light: { '--color-bg': '#fffbeb', '--color-bg-secondary': '#ffffff', '--color-text': '#78350f', '--color-text-secondary': '#92400e', '--color-accent': '#f59e0b', '--color-accent-hover': '#d97706', '--color-border': '#fde68a', '--color-card-bg': '#ffffff', '--color-card-shadow': 'rgba(0,0,0,0.06)', '--color-tag-bg': '#fef3c7', '--color-tag-text': '#92400e', '--color-filter-active-bg': '#f59e0b', '--color-filter-active-text': '#ffffff' },
    dark: { '--color-bg': '#1c1200', '--color-bg-secondary': '#292200', '--color-text': '#fef3c7', '--color-text-secondary': '#fcd34d', '--color-accent': '#fbbf24', '--color-accent-hover': '#fcd34d', '--color-border': '#44330a', '--color-card-bg': '#292200', '--color-card-shadow': 'rgba(0,0,0,0.3)', '--color-tag-bg': '#44330a', '--color-tag-text': '#fcd34d', '--color-filter-active-bg': '#fbbf24', '--color-filter-active-text': '#1c1200' },
  },
};

interface ColorRowProps {
  varName: ColorVar;
  value: string;
  onChange: (v: string) => void;
}

function ColorRow({ varName, value, onChange }: ColorRowProps) {
  const [open, setOpen] = useState(false);
  const isShadow = varName === '--color-card-shadow';
  const label = varName.replace('--color-', '').replace(/-/g, ' ');

  return (
    <div className="color-row">
      <div className="color-row-header" onClick={() => !isShadow && setOpen((v) => !v)}>
        {!isShadow && (
          <span className="color-swatch" style={{ background: value }} aria-hidden="true" />
        )}
        <span className="color-label">{label}</span>
      </div>
      {isShadow ? (
        <input
          type="text"
          className="field-input color-text-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={varName}
        />
      ) : (
        <>
          <input
            type="color"
            className="color-native"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${varName} (native picker)`}
          />
          {open && (
            <div className="color-picker-popup">
              <HexColorPicker color={value.startsWith('#') ? value : '#000000'} onChange={onChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ThemeEditor() {
  const { themeLight, themeDark, setTheme } = usePortfolioStore();
  const [tab, setTab] = useState<'light' | 'dark'>('light');
  const theme = tab === 'light' ? themeLight : themeDark;

  function handleChange(varName: ColorVar, value: string) {
    setTheme(tab, { [varName]: value });
  }

  function applyPreset(presetName: string) {
    const preset = PRESETS[presetName];
    if (!preset) return;
    setTheme('light', preset.light);
    setTheme('dark', preset.dark);
  }

  return (
    <div className="theme-editor">
      <p className="editor-hint">Choose a preset or fine-tune individual colours for your portfolio's light and dark themes.</p>
      <div className="theme-presets">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            type="button"
            className="preset-btn"
            onClick={() => applyPreset(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="theme-tabs">
        <button
          type="button"
          className={`theme-tab${tab === 'light' ? ' theme-tab--active' : ''}`}
          onClick={() => setTab('light')}
        >
          Light
        </button>
        <button
          type="button"
          className={`theme-tab${tab === 'dark' ? ' theme-tab--active' : ''}`}
          onClick={() => setTab('dark')}
        >
          Dark
        </button>
      </div>
      <div className="theme-color-list">
        {COLOR_VARS.map((v) => (
          <ColorRow key={v} varName={v} value={theme[v]} onChange={(val) => handleChange(v, val)} />
        ))}
      </div>
    </div>
  );
}
