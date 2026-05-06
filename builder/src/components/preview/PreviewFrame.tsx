import { useState } from 'react';
import { usePortfolioStore } from '../../state/store';
import { applyThemeVars } from '../../lib/theme';
import PreviewNavbar from './PreviewNavbar';
import PreviewHero from './PreviewHero';
import PreviewProjectGrid from './PreviewProjectGrid';
import PreviewAbout from './PreviewAbout';
import PreviewContact from './PreviewContact';
import PreviewFooter from './PreviewFooter';
import './PreviewFrame.css';

export default function PreviewFrame() {
  const { hero, site, about, contact, social, donations, nav, projects, themeLight, themeDark } =
    usePortfolioStore();
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const themeColors = colorMode === 'light' ? themeLight : themeDark;
  const cssVars = applyThemeVars(themeColors);

  return (
    <div className="preview-frame">
      <div className="preview-controls">
        <div className="preview-mode-group">
          <button
            type="button"
            className={`pv-ctrl-btn${colorMode === 'light' ? ' pv-ctrl-btn--active' : ''}`}
            onClick={() => setColorMode('light')}
            aria-pressed={colorMode === 'light'}
          >
            Light
          </button>
          <button
            type="button"
            className={`pv-ctrl-btn${colorMode === 'dark' ? ' pv-ctrl-btn--active' : ''}`}
            onClick={() => setColorMode('dark')}
            aria-pressed={colorMode === 'dark'}
          >
            Dark
          </button>
        </div>
        <div className="preview-mode-group">
          <button
            type="button"
            className={`pv-ctrl-btn${viewMode === 'desktop' ? ' pv-ctrl-btn--active' : ''}`}
            onClick={() => setViewMode('desktop')}
            aria-pressed={viewMode === 'desktop'}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`pv-ctrl-btn${viewMode === 'mobile' ? ' pv-ctrl-btn--active' : ''}`}
            onClick={() => setViewMode('mobile')}
            aria-pressed={viewMode === 'mobile'}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className="preview-scroll">
        <div
          className={`preview-content${viewMode === 'mobile' ? ' preview-content--mobile' : ''}`}
          style={cssVars as React.CSSProperties}
          data-theme={colorMode}
        >
          <PreviewNavbar title={site.title} nav={nav} />
          <PreviewHero {...hero} />
          <div className="section">
            <div className="container">
              <h2 className="section-title">Projects</h2>
              <PreviewProjectGrid projects={projects} />
            </div>
          </div>
          <PreviewAbout bio={about.bio} skills={about.skills} />
          <PreviewContact intro={contact.intro} />
          <PreviewFooter name={hero.name} social={social} donations={donations} />
        </div>
      </div>
    </div>
  );
}
