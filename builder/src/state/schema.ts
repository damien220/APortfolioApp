import { z } from 'zod';

export const SocialLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.enum(['github', 'linkedin', 'twitter', 'email', 'website']),
});

export const DonationLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.enum(['patreon', 'buymeacoffee']),
});

export const SkillCategorySchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

export const NavItemSchema = z.object({
  href: z.string(),
  label: z.string(),
});

export const SiteSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string(),
});

export const HeroSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  subtitle: z.string(),
  portrait: z.string(),
});

export const AboutSchema = z.object({
  bio: z.string(),
  skills: z.array(SkillCategorySchema),
});

export const ContactSchema = z.object({
  intro: z.string(),
  formspreeId: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['Web App', 'CLI Tool', 'Library', 'API', 'Mobile App', 'Data/ML']),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  image: z.string().optional(),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  body: z.string().optional(),
  date: z.string(),
});

export const ThemeColorsSchema = z.object({
  '--color-bg': z.string(),
  '--color-bg-secondary': z.string(),
  '--color-text': z.string(),
  '--color-text-secondary': z.string(),
  '--color-accent': z.string(),
  '--color-accent-hover': z.string(),
  '--color-border': z.string(),
  '--color-card-bg': z.string(),
  '--color-card-shadow': z.string(),
  '--color-tag-bg': z.string(),
  '--color-tag-text': z.string(),
  '--color-filter-active-bg': z.string(),
  '--color-filter-active-text': z.string(),
});

export const PortfolioStateSchema = z.object({
  site: SiteSchema,
  hero: HeroSchema,
  about: AboutSchema,
  contact: ContactSchema,
  social: z.array(SocialLinkSchema),
  donations: z.array(DonationLinkSchema),
  nav: z.array(NavItemSchema),
  projects: z.array(ProjectSchema),
  themeLight: ThemeColorsSchema,
  themeDark: ThemeColorsSchema,
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type DonationLink = z.infer<typeof DonationLinkSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type NavItem = z.infer<typeof NavItemSchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Hero = z.infer<typeof HeroSchema>;
export type About = z.infer<typeof AboutSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;
export type PortfolioState = z.infer<typeof PortfolioStateSchema>;
