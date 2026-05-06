import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../state/store';
import { PortfolioStateSchema } from '../state/schema';
import SiteEditor from '../components/editor/SiteEditor';
import HeroEditor from '../components/editor/HeroEditor';
import AboutEditor from '../components/editor/AboutEditor';
import SkillsEditor from '../components/editor/SkillsEditor';
import ProjectsEditor from '../components/editor/ProjectsEditor';
import SocialEditor from '../components/editor/SocialEditor';
import ContactEditor from '../components/editor/ContactEditor';
import ThemeEditor from '../components/editor/ThemeEditor';
import ImagesEditor from '../components/editor/ImagesEditor';
import PreviewFrame from '../components/preview/PreviewFrame';
import './BuilderPage.css';

const SECTIONS = [
  'Site',
  'Hero',
  'About',
  'Skills',
  'Projects',
  'Social',
  'Contact',
  'Theme',
  'Images',
] as const;

type Section = (typeof SECTIONS)[number];
type MobileTab = 'edit' | 'preview';

function renderEditor(section: Section) {
  switch (section) {
    case 'Site': return <SiteEditor />;
    case 'Hero': return <HeroEditor />;
    case 'About': return <AboutEditor />;
    case 'Skills': return <SkillsEditor />;
    case 'Projects': return <ProjectsEditor />;
    case 'Social': return <SocialEditor />;
    case 'Contact': return <ContactEditor />;
    case 'Theme': return <ThemeEditor />;
    case 'Images': return <ImagesEditor />;
  }
}

export default function BuilderPage() {
  const [openSection, setOpenSection] = useState<Section | null>('Site');
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(320);
  const navigate = useNavigate();

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!resizingRef.current) return;
      const delta = e.clientX - startXRef.current;
      setSidebarWidth(Math.min(600, Math.max(240, startWidthRef.current + delta)));
    }
    function onMouseUp() { resizingRef.current = false; }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function handleResizeMouseDown(e: React.MouseEvent) {
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    e.preventDefault();
  }

  function toggleSection(section: Section) {
    setOpenSection((prev) => (prev === section ? null : section));
    setDrawerOpen(false);
  }

  function handleNew() {
    if (confirm('Discard the current portfolio and start fresh?')) {
      usePortfolioStore.getState().resetToDefaults();
      navigate('/');
    }
  }

  function handleExport() {
    navigate('/export');
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = JSON.parse(e.target?.result as string) as unknown;
          const result = PortfolioStateSchema.safeParse(raw);
          if (result.success) {
            usePortfolioStore.setState(result.data);
          } else {
            alert('Invalid state file.');
          }
        } catch {
          alert('Could not read file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  const sidebarContent = (
    <nav className="builder-sidebar" aria-label="Editor sections">
      {SECTIONS.map((section) => {
        const isOpen = openSection === section;
        return (
          <div key={section} className={`accordion-item${isOpen ? ' accordion-item--open' : ''}`}>
            <button
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => toggleSection(section)}
            >
              <span className="accordion-label">{section}</span>
              <span className="accordion-chevron" aria-hidden="true">
                {isOpen ? '▲' : '▼'}
              </span>
            </button>
            {isOpen && (
              <div className="accordion-panel" role="region">
                {renderEditor(section)}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="builder-shell">
      <header className="builder-topbar">
        <div className="topbar-left">
          <button
            className="topbar-btn topbar-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open editor menu"
            aria-expanded={drawerOpen}
          >
            ☰
          </button>
          <span className="topbar-title">APortfolioApp</span>
        </div>
        <div className="topbar-actions">
          <button
            className="topbar-btn topbar-help-btn"
            onClick={() => navigate('/help')}
            aria-label="Help"
            title="User Guide"
          >
            ?
          </button>
          <button className="topbar-btn" onClick={handleNew}>
            New
          </button>
          <button className="topbar-btn" onClick={handleImport}>
            Import
          </button>
          <button className="topbar-btn topbar-btn--accent" onClick={handleExport}>
            Export
          </button>
        </div>
      </header>

      <div className="builder-mobile-tabs" role="tablist" aria-label="View switcher">
        <button
          role="tab"
          aria-selected={mobileTab === 'edit'}
          className={`mobile-tab${mobileTab === 'edit' ? ' mobile-tab--active' : ''}`}
          onClick={() => setMobileTab('edit')}
        >
          Edit
        </button>
        <button
          role="tab"
          aria-selected={mobileTab === 'preview'}
          className={`mobile-tab${mobileTab === 'preview' ? ' mobile-tab--active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          Preview
        </button>
      </div>

      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="builder-body">
        <div
          className={`builder-sidebar-wrapper${mobileTab === 'edit' ? ' mobile-visible' : ''}${drawerOpen ? ' drawer-open' : ''}`}
          style={{ width: sidebarWidth }}
        >
          <button
            className="drawer-close-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
          {sidebarContent}
          <div className="sidebar-resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>
        <div className={`builder-preview-wrapper${mobileTab === 'preview' ? ' mobile-visible' : ''}`}>
          <PreviewFrame />
        </div>
      </div>
    </div>
  );
}
