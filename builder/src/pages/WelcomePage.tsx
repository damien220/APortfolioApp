import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../state/store';
import type { PortfolioState } from '../state/schema';
import './WelcomePage.css';

const SAMPLE_DATA: PortfolioState = {
  site: {
    url: 'https://jane.dev',
    title: 'Jane Dev',
    description: 'Full-stack developer passionate about clean code and great UX.',
  },
  hero: {
    name: 'Jane Developer',
    tagline: 'Building delightful web experiences.',
    subtitle: 'Full-stack developer with a love for TypeScript, React, and elegant APIs.',
    portrait: '',
  },
  about: {
    bio: "Hi, I'm Jane! I've been building web applications for over 6 years.\nI specialize in TypeScript, React, and Node.js, and I care deeply about\nperformance, accessibility, and developer experience.",
    skills: [
      { title: 'Languages', items: ['TypeScript', 'Python', 'HTML / CSS'] },
      { title: 'Frameworks', items: ['React', 'Astro', 'Express', 'FastAPI'] },
      { title: 'Tools', items: ['Git', 'Docker', 'PostgreSQL', 'Vite'] },
    ],
  },
  contact: {
    intro: "Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you within 24 hours.",
    formspreeId: 'YOUR_FORM_ID',
  },
  social: [
    { label: 'GitHub', url: 'https://github.com/janedev', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/janedev', icon: 'linkedin' },
    { label: 'Twitter', url: 'https://twitter.com/janedev', icon: 'twitter' },
  ],
  donations: [
    { label: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/janedev', icon: 'buymeacoffee' },
  ],
  nav: [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  projects: [
    {
      id: 'sample-1',
      title: 'DevTracker',
      description: 'A full-stack project management tool built for solo developers and small teams.',
      type: 'Web App',
      tags: ['TypeScript', 'React', 'PostgreSQL', 'Express'],
      featured: true,
      date: '2026-01',
      liveUrl: 'https://devtracker.example.com',
      repoUrl: 'https://github.com/janedev/devtracker',
      body: '## Overview\n\nDevTracker helps developers manage tasks, milestones, and time tracking in one place.',
    },
    {
      id: 'sample-2',
      title: 'schema-gen',
      description: 'A CLI tool that auto-generates Zod schemas from TypeScript types.',
      type: 'CLI Tool',
      tags: ['TypeScript', 'Node.js', 'Zod'],
      featured: false,
      date: '2025-09',
      repoUrl: 'https://github.com/janedev/schema-gen',
      body: '## Overview\n\nschema-gen reads your TypeScript types and outputs Zod validation schemas automatically.',
    },
  ],
  themeLight: {
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
  },
  themeDark: {
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
  },
};

export default function WelcomePage() {
  const navigate = useNavigate();

  function handleLoadSample() {
    usePortfolioStore.setState(SAMPLE_DATA);
    navigate('/builder');
  }

  return (
    <main className="welcome-page">
      <div className="welcome-card">
        <h1 className="welcome-title">APortfolioApp</h1>
        <p className="welcome-subtitle">
          Build and customize your APortfolio site without editing code.
          Fill in your details, preview the result, and export a ready-to-deploy package.
        </p>

        <ol className="welcome-steps" aria-label="How it works">
          <li className="welcome-step">
            <span className="welcome-step-num" aria-hidden="true">1</span>
            <div className="welcome-step-body">
              <strong>Fill in your details</strong>
              <span>Name, bio, projects, social links — all in the editor panels</span>
            </div>
          </li>
          <li className="welcome-step">
            <span className="welcome-step-num" aria-hidden="true">2</span>
            <div className="welcome-step-body">
              <strong>Preview in real time</strong>
              <span>See your portfolio update instantly as you type</span>
            </div>
          </li>
          <li className="welcome-step">
            <span className="welcome-step-num" aria-hidden="true">3</span>
            <div className="welcome-step-body">
              <strong>Export &amp; deploy</strong>
              <span>Download a ZIP and drop it on Netlify — live in 30 seconds</span>
            </div>
          </li>
        </ol>

        <div className="welcome-actions">
          <button
            className="welcome-cta"
            onClick={() => navigate('/builder')}
          >
            Start building
          </button>
          <button
            className="welcome-sample-btn"
            onClick={handleLoadSample}
          >
            Load sample portfolio
          </button>
        </div>

        <p className="welcome-note">
          Your work is auto-saved in your browser.{' '}
          <button className="welcome-link-btn" onClick={() => navigate('/help')}>
            Learn more →
          </button>
        </p>
      </div>
    </main>
  );
}
