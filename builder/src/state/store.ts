import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  type PortfolioState,
  type Site,
  type Hero,
  type About,
  type Contact,
  type SocialLink,
  type DonationLink,
  type NavItem,
  type SkillCategory,
  type Project,
  type ThemeColors,
} from './schema';
import { saveToStorage, loadFromStorage } from './persist';

const DEFAULT_LIGHT_THEME: ThemeColors = {
  '--color-bg': '#fafafa',
  '--color-bg-secondary': '#ffffff',
  '--color-text': '#1a1a2e',
  '--color-text-secondary': '#4a4a6a',
  '--color-accent': '#6366f1',
  '--color-accent-hover': '#4f46e5',
  '--color-border': '#e2e8f0',
  '--color-card-bg': '#ffffff',
  '--color-card-shadow': 'rgba(0,0,0,0.08)',
  '--color-tag-bg': '#eef2ff',
  '--color-tag-text': '#4338ca',
  '--color-filter-active-bg': '#6366f1',
  '--color-filter-active-text': '#ffffff',
};

const DEFAULT_DARK_THEME: ThemeColors = {
  '--color-bg': '#0f0f1a',
  '--color-bg-secondary': '#1a1a2e',
  '--color-text': '#e2e8f0',
  '--color-text-secondary': '#94a3b8',
  '--color-accent': '#818cf8',
  '--color-accent-hover': '#a5b4fc',
  '--color-border': '#2d2d44',
  '--color-card-bg': '#1a1a2e',
  '--color-card-shadow': 'rgba(0,0,0,0.3)',
  '--color-tag-bg': '#2d2d54',
  '--color-tag-text': '#a5b4fc',
  '--color-filter-active-bg': '#818cf8',
  '--color-filter-active-text': '#0f0f1a',
};

const DEFAULT_STATE: PortfolioState = {
  site: {
    url: 'https://your-domain.com',
    title: 'Portfolio',
    description: 'Portfolio showcasing my projects',
  },
  hero: {
    name: 'Your Name',
    tagline: 'Building things that make a difference.',
    subtitle:
      'Developer passionate about clean code, thoughtful design, and solving real problems.',
    portrait: '',
  },
  about: {
    bio: "Hello! I'm a developer who enjoys building useful tools and applications.\nReplace this paragraph with your own bio — your background, what drives you,\nand what you're looking for.",
    skills: [
      { title: 'Languages', items: ['JavaScript / TypeScript', 'Python', 'HTML / CSS'] },
      { title: 'Frameworks', items: ['React', 'Astro', 'FastAPI'] },
      { title: 'Tools', items: ['Git', 'Docker', 'PostgreSQL'] },
    ],
  },
  contact: {
    intro: 'Have a question or want to work together? Send me a message.',
    formspreeId: 'YOUR_FORM_ID',
  },
  social: [
    { label: 'GitHub', url: 'https://github.com/yourusername', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: 'linkedin' },
  ],
  donations: [
    {
      label: 'Buy Me a Coffee',
      url: 'https://buymeacoffee.com/yourusername',
      icon: 'buymeacoffee',
    },
    { label: 'Patreon', url: 'https://patreon.com/yourusername', icon: 'patreon' },
  ],
  nav: [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  projects: [],
  themeLight: DEFAULT_LIGHT_THEME,
  themeDark: DEFAULT_DARK_THEME,
};

interface StoreActions {
  updateSite: (patch: Partial<Site>) => void;
  updateHero: (patch: Partial<Hero>) => void;
  updateAbout: (patch: Partial<About>) => void;
  updateContact: (patch: Partial<Contact>) => void;
  setSocial: (links: SocialLink[]) => void;
  setDonations: (links: DonationLink[]) => void;
  setNav: (items: NavItem[]) => void;
  setSkills: (skills: SkillCategory[]) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  setTheme: (mode: 'light' | 'dark', colors: Partial<ThemeColors>) => void;
  resetToDefaults: () => void;
}

type StoreShape = PortfolioState & StoreActions;

function buildStore(
  set: (fn: (s: StoreShape) => Partial<StoreShape>) => void,
): StoreShape {
  return {
    ...DEFAULT_STATE,

    updateSite: (patch) =>
      set((s) => ({ site: { ...s.site, ...patch } })),

    updateHero: (patch) =>
      set((s) => ({ hero: { ...s.hero, ...patch } })),

    updateAbout: (patch) =>
      set((s) => ({ about: { ...s.about, ...patch } })),

    updateContact: (patch) =>
      set((s) => ({ contact: { ...s.contact, ...patch } })),

    setSocial: (links) => set(() => ({ social: links })),

    setDonations: (links) => set(() => ({ donations: links })),

    setNav: (items) => set(() => ({ nav: items })),

    setSkills: (skills) =>
      set((s) => ({ about: { ...s.about, skills } })),

    setProjects: (projects) => set(() => ({ projects })),

    addProject: (project) =>
      set((s) => ({ projects: [...s.projects, project] })),

    removeProject: (id) =>
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

    updateProject: (id, patch) =>
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),

    setTheme: (mode, colors) =>
      mode === 'light'
        ? set((s) => ({ themeLight: { ...s.themeLight, ...colors } }))
        : set((s) => ({ themeDark: { ...s.themeDark, ...colors } })),

    resetToDefaults: () => set(() => ({ ...DEFAULT_STATE })),
  };
}

export const usePortfolioStore = create<StoreShape>()(
  subscribeWithSelector((set) => buildStore(set)),
);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

usePortfolioStore.subscribe(
  (state) => state,
  (state) => {
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const { ...portfolioState } = state as StoreShape;
      saveToStorage(portfolioState as PortfolioState);
    }, 500);
  },
);

const persisted = loadFromStorage();
if (persisted) {
  usePortfolioStore.setState(persisted);
}
