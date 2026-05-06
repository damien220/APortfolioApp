import type { PortfolioState, Project } from '../state/schema';

export function generateSiteConfigTs(state: PortfolioState): string {
  const { site, hero, about, contact, social, donations, nav } = state;

  const skillsTs = about.skills
    .map(
      (cat) =>
        `    { title: ${JSON.stringify(cat.title)}, items: ${JSON.stringify(cat.items)} }`,
    )
    .join(',\n');

  const socialTs = social
    .map(
      (s) =>
        `    { label: ${JSON.stringify(s.label)}, url: ${JSON.stringify(s.url)}, icon: ${JSON.stringify(s.icon)} }`,
    )
    .join(',\n');

  const donationsTs = donations
    .map(
      (d) =>
        `    { label: ${JSON.stringify(d.label)}, url: ${JSON.stringify(d.url)}, icon: ${JSON.stringify(d.icon)} }`,
    )
    .join(',\n');

  const navTs = nav
    .map(
      (n) =>
        `    { href: ${JSON.stringify(n.href)}, label: ${JSON.stringify(n.label)} }`,
    )
    .join(',\n');

  return `export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'email' | 'website';
}

export interface DonationLink {
  label: string;
  url: string;
  icon: 'patreon' | 'buymeacoffee';
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export const siteConfig = {
  site: {
    url: ${JSON.stringify(site.url)},
    title: ${JSON.stringify(site.title)},
    description: ${JSON.stringify(site.description)},
  },
  hero: {
    name: ${JSON.stringify(hero.name)},
    tagline: ${JSON.stringify(hero.tagline)},
    subtitle: ${JSON.stringify(hero.subtitle)},
    portrait: ${JSON.stringify(hero.portrait)},
  },
  about: {
    bio: ${JSON.stringify(about.bio)},
    skills: [
${skillsTs}
    ] as SkillCategory[],
  },
  contact: {
    intro: ${JSON.stringify(contact.intro)},
    formspreeId: ${JSON.stringify(contact.formspreeId)},
  },
  social: [
${socialTs}
  ] as SocialLink[],
  donations: [
${donationsTs}
  ] as DonationLink[],
  nav: [
${navTs}
  ],
};
`;
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'project'
  );
}

export function generateProjectMd(project: Project): string {
  const { title, description, type, tags, featured, image, liveUrl, repoUrl, date, body } = project;

  const lines: string[] = ['---'];
  lines.push(`title: ${JSON.stringify(title)}`);
  lines.push(`description: ${JSON.stringify(description)}`);
  lines.push(`type: ${JSON.stringify(type)}`);
  lines.push(`tags: ${JSON.stringify(tags)}`);
  if (featured) lines.push(`featured: true`);
  if (image) lines.push(`image: ${JSON.stringify(image)}`);
  if (liveUrl) lines.push(`liveUrl: ${JSON.stringify(liveUrl)}`);
  if (repoUrl) lines.push(`repoUrl: ${JSON.stringify(repoUrl)}`);
  lines.push(`date: ${JSON.stringify(date)}`);
  lines.push('---');

  if (body) {
    lines.push('');
    lines.push(body);
  }

  return lines.join('\n');
}

export { slugify };

export function generateGlobalCss(state: PortfolioState): string {
  const l = state.themeLight;
  const d = state.themeDark;

  return `:root {
  --color-bg: ${l['--color-bg']};
  --color-bg-secondary: ${l['--color-bg-secondary']};
  --color-text: ${l['--color-text']};
  --color-text-secondary: ${l['--color-text-secondary']};
  --color-accent: ${l['--color-accent']};
  --color-accent-hover: ${l['--color-accent-hover']};
  --color-border: ${l['--color-border']};
  --color-card-bg: ${l['--color-card-bg']};
  --color-card-shadow: ${l['--color-card-shadow']};
  --color-tag-bg: ${l['--color-tag-bg']};
  --color-tag-text: ${l['--color-tag-text']};
  --color-filter-active-bg: ${l['--color-filter-active-bg']};
  --color-filter-active-text: ${l['--color-filter-active-text']};

  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  --max-width: 1200px;
  --border-radius: 8px;
  --border-radius-lg: 12px;

  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}

[data-theme="dark"] {
  --color-bg: ${d['--color-bg']};
  --color-bg-secondary: ${d['--color-bg-secondary']};
  --color-text: ${d['--color-text']};
  --color-text-secondary: ${d['--color-text-secondary']};
  --color-accent: ${d['--color-accent']};
  --color-accent-hover: ${d['--color-accent-hover']};
  --color-border: ${d['--color-border']};
  --color-card-bg: ${d['--color-card-bg']};
  --color-card-shadow: ${d['--color-card-shadow']};
  --color-tag-bg: ${d['--color-tag-bg']};
  --color-tag-text: ${d['--color-tag-text']};
  --color-filter-active-bg: ${d['--color-filter-active-bg']};
  --color-filter-active-text: ${d['--color-filter-active-text']};
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  transition: background-color var(--transition-base), color var(--transition-base);
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-accent-hover);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.section {
  padding: var(--space-3xl) 0;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--space-xl);
  color: var(--color-text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.5s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 640px) {
  .section {
    padding: var(--space-2xl) 0;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .container {
    padding: 0 var(--space-md);
  }
}
`;
}
