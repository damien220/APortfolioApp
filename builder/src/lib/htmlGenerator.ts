import type { PortfolioState, Project } from '../state/schema';
import { generateGlobalCss, slugify } from './templates';

// SVG icon paths (same as Footer.astro)
const ICON_PATHS: Record<string, string> = {
  github:
    'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  twitter:
    'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
  email:
    'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z',
  website:
    'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 20.93C6.5 20.46 3 16.64 3 12c0-.7.08-1.37.23-2L7 14.01V15c0 1.1.9 2 2 2v2.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H9v-2h2c.55 0 1-.45 1-1V8h2c1.1 0 2-.9 2-2v-.41C19.93 7.14 21 9.45 21 12c0 2.54-1.54 4.74-3.77 5.69z',
  patreon:
    'M22.957 7.21c-.004-3.064-2.391-5.576-5.191-6.482-3.478-1.125-8.064-.962-11.384.604C2.357 3.231 1.093 7.391 1.046 11.54c-.039 3.411.302 12.396 5.369 12.46 3.765.047 4.326-4.804 6.068-7.141 1.24-1.662 2.836-2.132 4.801-2.618 3.376-.836 5.678-3.501 5.673-7.031Z',
  buymeacoffee:
    'M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z',
};

function esc(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const THEME_SCRIPT = `<script>try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>`;

const THEME_TOGGLE_JS = `(function(){var c=document.documentElement.getAttribute('data-theme');var n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);localStorage.setItem('theme',n);})()`;

function navbar(state: PortfolioState, active: string): string {
  const links = state.nav
    .map(({ href, label }) => `<li><a href="${esc(href)}"${href === active ? ' class="active"' : ''}>${esc(label)}</a></li>`)
    .join('');
  return `<header class="navbar"><div class="container navbar-inner"><a href="/" class="navbar-logo">${esc(state.site.title)}</a><nav><ul class="navbar-links">${links}</ul></nav><button class="theme-toggle" aria-label="Toggle dark mode" onclick="${esc(THEME_TOGGLE_JS)}"><svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></button></div></header>`;
}

function footer(state: PortfolioState): string {
  const year = new Date().getFullYear();
  const socials = state.social
    .map(({ label, url, icon }) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="${ICON_PATHS[icon] ?? ''}"></path></svg></a>`)
    .join('');
  const donations = state.donations.length
    ? `<span class="footer-sep" aria-hidden="true"></span>` +
      state.donations
        .map(({ label, url, icon }) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}" class="donation-link"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="${ICON_PATHS[icon] ?? ''}"></path></svg></a>`)
        .join('')
    : '';
  return `<footer class="footer"><div class="container footer-inner"><p>&copy; ${year} ${esc(state.hero.name)}. All rights reserved.</p><div class="footer-links">${socials}${donations}</div></div></footer>`;
}

function layout(title: string, desc: string, body: string, state: PortfolioState, active: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<link rel="icon" href="/favicon.ico"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="description" content="${esc(desc)}"/>
<link rel="stylesheet" href="/assets/style.css"/>
${THEME_SCRIPT}
<title>${esc(title)}</title>
</head>
<body>
${navbar(state, active)}
<main>${body}</main>
${footer(state)}
</body>
</html>`;
}

function projectCard(p: Project, index: number): string {
  const slug = slugify(p.title);
  const img = p.image
    ? `<img src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" loading="lazy"/>`
    : `<div class="card-image-placeholder"><span>${esc(p.title[0])}</span></div>`;
  const tags = p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  return `<div class="grid-item fade-in${p.featured ? ' featured-item' : ''}" data-type="${esc(p.type)}" style="animation-delay:${index * 60}ms"><article class="project-card${p.featured ? ' featured' : ''}"><a href="/projects/${slug}" class="card-link"><div class="card-image">${img}</div><div class="card-content"><span class="card-type">${esc(p.type)}</span><h3 class="card-title">${esc(p.title)}</h3><p class="card-description">${esc(p.description)}</p><div class="card-tags">${tags}</div></div></a></article></div>`;
}

function homePage(state: PortfolioState): string {
  const { hero } = state;
  const portrait = hero.portrait
    ? `<img src="${esc(hero.portrait)}" alt="Portrait of ${esc(hero.name)}" class="portrait-img"/>`
    : `<div class="portrait-placeholder" aria-hidden="true">${esc(hero.name.charAt(0))}</div>`;

  const featured = state.projects.filter((p) => p.featured);
  const featuredGrid = featured.length
    ? `<div class="project-grid">${featured.map((p, i) => projectCard(p, i)).join('')}</div><div class="view-all"><a href="/projects" class="view-all-link">View all projects &rarr;</a></div>`
    : `<p class="empty-state">No featured projects yet. See <a href="/projects">all projects</a>.</p>`;

  const body = `
<section class="hero">
  <div class="container">
    <div class="hero-inner">
      <div class="hero-portrait">${portrait}</div>
      <div class="hero-content">
        <p class="hero-greeting">Hi, I'm</p>
        <h1 class="hero-name">${esc(hero.name)}</h1>
        <p class="hero-tagline">${esc(hero.tagline)}</p>
        ${hero.subtitle ? `<p class="hero-subtitle">${esc(hero.subtitle)}</p>` : ''}
        <div class="hero-actions">
          <a href="/projects" class="btn btn-primary">View Projects</a>
          <a href="/contact" class="btn btn-outline">Get in Touch</a>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="section container">
  <h2 class="section-title">Featured Projects</h2>
  ${featuredGrid}
</section>`;

  return layout(`${state.site.title} — Home`, state.site.description, body, state, '/');
}

function projectsPage(state: PortfolioState): string {
  const sorted = [...state.projects].sort((a, b) => b.date.localeCompare(a.date));
  const types = [...new Set(sorted.map((p) => p.type))].sort();
  const filterBtns = types.map((t) => `<button class="filter-btn" data-filter="${esc(t)}">${esc(t)}</button>`).join('');
  const cards = sorted.map((p, i) => projectCard(p, i)).join('');

  const filterScript = `<script>document.getElementById('pf')?.addEventListener('click',function(e){var b=e.target.closest('.filter-btn');if(!b)return;document.querySelectorAll('.filter-btn').forEach(function(x){x.classList.remove('active');});b.classList.add('active');var f=b.dataset.filter;document.querySelectorAll('.grid-item').forEach(function(item){item.style.display=(f==='all'||item.dataset.type===f)?'':'none';});});</script>`;

  const body = `<section class="section container">
  <h1 class="section-title">All Projects</h1>
  <p class="section-subtitle">Filter by type to find what interests you.</p>
  <div class="filters" id="pf">
    <button class="filter-btn active" data-filter="all">All</button>
    ${filterBtns}
  </div>
  <div class="project-grid">${cards}</div>
</section>${filterScript}`;

  return layout(`Projects — ${state.site.title}`, 'Browse all my projects by type and technology.', body, state, '/projects');
}

function projectPage(p: Project, state: PortfolioState): string {
  const tags = p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const liveBtn = p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo</a>` : '';
  const repoBtn = p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Source Code</a>` : '';
  const bodyText = p.body ? `<div class="project-content"><p>${esc(p.body).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p></div>` : '';

  const body = `<article class="section container project-detail">
  <a href="/projects" class="back-link">&larr; Back to Projects</a>
  <header class="project-header">
    <span class="project-type">${esc(p.type)}</span>
    <h1>${esc(p.title)}</h1>
    <p class="project-description">${esc(p.description)}</p>
    <div class="project-tags">${tags}</div>
    <div class="project-links">${liveBtn}${repoBtn}</div>
  </header>
  ${bodyText}
</article>`;

  return layout(`${p.title} — ${state.site.title}`, p.description, body, state, '/projects');
}

function aboutPage(state: PortfolioState): string {
  const skillCats = state.about.skills
    .map(
      (cat) =>
        `<div class="skill-category"><h3>${esc(cat.title)}</h3><ul>${cat.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`,
    )
    .join('');

  const body = `<section class="section container about">
  <h1 class="section-title">About Me</h1>
  <div class="about-content">
    <p>${esc(state.about.bio).replace(/\n/g, '<br/>')}</p>
    <h2>Skills</h2>
    <div class="skills-grid">${skillCats}</div>
  </div>
</section>`;

  return layout(`About — ${state.site.title}`, 'Learn more about me and my background.', body, state, '/about');
}

function contactPage(state: PortfolioState): string {
  const formAction = state.contact.formspreeId
    ? `https://formspree.io/f/${esc(state.contact.formspreeId)}`
    : '#';

  const body = `<section class="section container contact">
  <h1 class="section-title">Get in Touch</h1>
  <p class="contact-intro">${esc(state.contact.intro)}</p>
  <form class="contact-form" action="${formAction}" method="POST">
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required/>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required/>
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Send Message</button>
  </form>
</section>`;

  return layout(`Contact — ${state.site.title}`, 'Get in touch with me.', body, state, '/contact');
}

function componentCss(): string {
  return `
/* ===== Navbar ===== */
.navbar{position:sticky;top:0;z-index:100;background-color:var(--color-bg-secondary);border-bottom:1px solid var(--color-border);backdrop-filter:blur(8px)}
.navbar-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.navbar-logo{font-size:1.25rem;font-weight:700;color:var(--color-text)}
.navbar-logo:hover{color:var(--color-accent)}
.navbar-links{display:flex;list-style:none;gap:var(--space-lg)}
.navbar-links a{color:var(--color-text-secondary);font-weight:500;font-size:.9rem;padding:var(--space-xs) 0;border-bottom:2px solid transparent;transition:color var(--transition-fast),border-color var(--transition-fast)}
.navbar-links a:hover,.navbar-links a.active{color:var(--color-accent);border-bottom-color:var(--color-accent)}
.theme-toggle{background:none;border:1px solid var(--color-border);border-radius:var(--border-radius);padding:var(--space-sm);cursor:pointer;color:var(--color-text-secondary);display:flex;align-items:center;transition:color var(--transition-fast),border-color var(--transition-fast)}
.theme-toggle:hover{color:var(--color-accent);border-color:var(--color-accent)}
[data-theme="dark"] .icon-sun{display:block}
[data-theme="dark"] .icon-moon{display:none}
[data-theme="light"] .icon-sun,:root:not([data-theme]) .icon-sun{display:none}
[data-theme="light"] .icon-moon,:root:not([data-theme]) .icon-moon{display:block}
@media(max-width:640px){.navbar-links{gap:var(--space-md)}.navbar-links a{font-size:.85rem}}

/* ===== Footer ===== */
.footer{border-top:1px solid var(--color-border);padding:var(--space-xl) 0;margin-top:var(--space-3xl)}
.footer-inner{display:flex;align-items:center;justify-content:space-between}
.footer-inner p{color:var(--color-text-secondary);font-size:.875rem}
.footer-links{display:flex;align-items:center;gap:var(--space-md)}
.footer-links a{color:var(--color-text-secondary);transition:color var(--transition-fast)}
.footer-links a:hover,.donation-link:hover{color:var(--color-accent)}
.footer-sep{display:inline-block;width:1px;height:18px;background-color:var(--color-border);margin:0 var(--space-xs)}

/* ===== Hero ===== */
.hero{padding:var(--space-3xl) 0;min-height:60vh;display:flex;align-items:center}
.hero-inner{display:flex;align-items:center;gap:var(--space-2xl)}
.portrait-img,.portrait-placeholder{width:160px;height:160px;border-radius:50%;border:3px solid var(--color-border);box-shadow:0 4px 16px var(--color-card-shadow)}
.portrait-img{object-fit:cover;display:block}
.portrait-placeholder{background-color:var(--color-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:700;user-select:none}
.hero-greeting{font-size:1.1rem;color:var(--color-accent);font-weight:500;margin-bottom:var(--space-sm)}
.hero-name{font-size:clamp(2.5rem,6vw,4rem);font-weight:700;line-height:1.1;margin-bottom:var(--space-md)}
.hero-tagline{font-size:clamp(1.1rem,2.5vw,1.4rem);color:var(--color-text-secondary);max-width:600px;margin-bottom:var(--space-sm)}
.hero-subtitle{font-size:1rem;color:var(--color-text-secondary);max-width:550px;margin-bottom:var(--space-xl)}
.hero-actions{display:flex;gap:var(--space-md);margin-top:var(--space-lg)}
.btn{display:inline-flex;align-items:center;padding:.75rem 1.5rem;border-radius:var(--border-radius);font-weight:600;font-size:.95rem;transition:all var(--transition-fast);text-decoration:none}
.btn-primary{background-color:var(--color-accent);color:#fff}
.btn-primary:hover{background-color:var(--color-accent-hover);color:#fff}
.btn-outline{border:2px solid var(--color-border);color:var(--color-text)}
.btn-outline:hover{border-color:var(--color-accent);color:var(--color-accent)}
@media(max-width:640px){.hero-inner{flex-direction:column;text-align:center}.portrait-img,.portrait-placeholder{width:120px;height:120px;font-size:2.8rem}.hero-actions{justify-content:center}}

/* ===== Project Grid ===== */
.filters{display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-bottom:var(--space-xl)}
.filter-btn{padding:.5rem 1rem;border:1px solid var(--color-border);border-radius:9999px;background:transparent;color:var(--color-text-secondary);font-size:.85rem;font-weight:500;cursor:pointer;transition:all var(--transition-fast);font-family:var(--font-sans)}
.filter-btn:hover{border-color:var(--color-accent);color:var(--color-accent)}
.filter-btn.active{background-color:var(--color-filter-active-bg);color:var(--color-filter-active-text);border-color:var(--color-filter-active-bg)}
.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-xl)}
.section-subtitle{color:var(--color-text-secondary);margin-bottom:var(--space-xl);margin-top:calc(-1 * var(--space-md))}
.view-all{text-align:center;margin-top:var(--space-xl)}
.view-all-link{font-weight:600;font-size:.95rem}
.empty-state{color:var(--color-text-secondary);text-align:center;padding:var(--space-xl)}
@media(max-width:640px){.project-grid{grid-template-columns:1fr}}

/* ===== Project Card ===== */
.project-card{background-color:var(--color-card-bg);border:1px solid var(--color-border);border-radius:var(--border-radius-lg);overflow:hidden;transition:transform var(--transition-base),box-shadow var(--transition-base)}
.project-card:hover{transform:translateY(-4px);box-shadow:0 12px 24px var(--color-card-shadow)}
.project-card.featured{border-color:var(--color-accent)}
.card-link{color:inherit;text-decoration:none;display:block}
.card-image{aspect-ratio:16/9;overflow:hidden;background-color:var(--color-bg-secondary)}
.card-image img{width:100%;height:100%;object-fit:cover;transition:transform var(--transition-base)}
.project-card:hover .card-image img{transform:scale(1.03)}
.card-image-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--color-accent),var(--color-accent-hover));color:#fff;font-size:2.5rem;font-weight:700}
.card-content{padding:var(--space-lg)}
.card-type{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--color-accent)}
.card-title{font-size:1.2rem;font-weight:600;margin:var(--space-xs) 0 var(--space-sm);color:var(--color-text)}
.card-description{font-size:.9rem;color:var(--color-text-secondary);line-height:1.5;margin-bottom:var(--space-md);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-tags{display:flex;flex-wrap:wrap;gap:var(--space-xs)}
.tag{font-size:.75rem;padding:.2rem .6rem;border-radius:9999px;background-color:var(--color-tag-bg);color:var(--color-tag-text);font-weight:500}

/* ===== Project Detail ===== */
.project-detail{max-width:800px}
.back-link{display:inline-block;margin-bottom:var(--space-xl);font-weight:500;font-size:.9rem}
.project-header{margin-bottom:var(--space-2xl)}
.project-type{font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--color-accent)}
.project-header h1{font-size:2.25rem;font-weight:700;margin:var(--space-sm) 0 var(--space-md)}
.project-description{font-size:1.1rem;color:var(--color-text-secondary);line-height:1.6;margin-bottom:var(--space-lg)}
.project-tags{display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-bottom:var(--space-lg)}
.project-tags .tag{font-size:.8rem;padding:.25rem .75rem}
.project-links{display:flex;gap:var(--space-md)}
.project-content{line-height:1.8}
.project-content h2{font-size:1.5rem;margin:var(--space-2xl) 0 var(--space-md)}
.project-content p{margin-bottom:var(--space-md);color:var(--color-text-secondary)}

/* ===== About ===== */
.about{max-width:800px}
.about-content p{font-size:1.1rem;color:var(--color-text-secondary);line-height:1.8;margin-bottom:var(--space-2xl);white-space:pre-line}
.about-content h2{font-size:1.5rem;margin-bottom:var(--space-lg)}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-xl)}
.skill-category h3{font-size:1rem;color:var(--color-accent);margin-bottom:var(--space-sm)}
.skill-category ul{list-style:none}
.skill-category li{padding:var(--space-xs) 0;color:var(--color-text-secondary);font-size:.95rem}

/* ===== Contact ===== */
.contact{max-width:600px}
.contact-intro{color:var(--color-text-secondary);margin-bottom:var(--space-2xl);margin-top:calc(-1 * var(--space-md))}
.contact-form{display:flex;flex-direction:column;gap:var(--space-lg)}
.form-group{display:flex;flex-direction:column;gap:var(--space-xs)}
.form-group label{font-weight:500;font-size:.9rem;color:var(--color-text)}
.form-group input,.form-group textarea{padding:.75rem 1rem;border:1px solid var(--color-border);border-radius:var(--border-radius);background-color:var(--color-bg-secondary);color:var(--color-text);font-family:var(--font-sans);font-size:.95rem;transition:border-color var(--transition-fast)}
.form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--color-accent)}
.contact-form .btn{border:none;justify-content:center;cursor:pointer;font-family:var(--font-sans)}
`;
}

export function generateStaticCss(state: PortfolioState): string {
  return generateGlobalCss(state) + componentCss();
}

export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#6366f1"/><text x="16" y="23" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="white">P</text></svg>`;

export function generateSitePages(state: PortfolioState): Record<string, string> {
  const pages: Record<string, string> = {};

  pages['index.html'] = homePage(state);
  pages['projects/index.html'] = projectsPage(state);
  pages['about/index.html'] = aboutPage(state);
  pages['contact/index.html'] = contactPage(state);

  for (const project of state.projects) {
    const slug = slugify(project.title);
    pages[`projects/${slug}/index.html`] = projectPage(project, state);
  }

  return pages;
}
