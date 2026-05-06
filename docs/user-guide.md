# APortfolioApp — User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Editor Sections](#editor-sections)
3. [Adding and Editing Projects](#adding-and-editing-projects)
4. [Themes](#themes)
5. [Saving and Importing Your Data](#saving-and-importing-your-data)
6. [Building and Deploying](#building-and-deploying)
7. [Re-editing Your Portfolio Later](#re-editing-your-portfolio-later)
8. [Keyboard & Accessibility](#keyboard--accessibility)

---

## Getting Started

Open the builder in your browser (`npm run dev` → `http://localhost:5173`).

On first launch you'll see the **Welcome screen**. You have two options:

- **Load example portfolio** — pre-fills every section with realistic sample content so you can explore the editor immediately.
- **Start from scratch** — opens the editor with empty fields ready for your own content.

Your changes are **auto-saved to `localStorage`** as you type. Closing and reopening the tab restores your work.

---

## Editor Sections

The left sidebar lists every editable section. Click a section name to switch to it.

| Section | What it controls |
|---------|-----------------|
| **Site** | Page `<title>`, canonical URL, and meta description used for SEO |
| **Hero** | Your name, tagline, short intro paragraph, and portrait photo |
| **About** | Bio text and skill categories (groups of technology tags) |
| **Projects** | Project cards shown on the portfolio — title, type, description, tags, date, links, cover image |
| **Contact** | Intro text, email address, and an optional contact-form note |
| **Nav** | Links shown in the site header — label and href for each item |
| **Social / Donations** | Footer links — social profiles (GitHub, LinkedIn, Twitter, Email) and donation platforms (Patreon, Buy Me a Coffee) |
| **Theme** | Colour palette for light and dark modes; choose a preset or tweak individual tokens |
| **Images** | Upload local images to get object URLs you can paste into project cards |

---

## Adding and Editing Projects

1. Go to the **Projects** section.
2. Click **+ Add Project** — a new row appears and the edit modal opens automatically.
3. Fill in the fields:
   - **Title** — displayed as the card heading.
   - **Type** — short category label (e.g. "Web App", "CLI Tool").
   - **Description** — shown on the card body; supports plain text.
   - **Tags** — comma-separated technologies; shown as chips.
   - **Date** — `YYYY-MM` format; shown on the card.
   - **Live URL / Repo URL** — optional links rendered as buttons.
   - **Cover image** — paste an object URL from the Images editor, or use the file picker (on mobile, the camera is offered automatically).
   - **Featured** — tick to promote the project to the top of the grid.
4. Close the modal with the **×** button, the **Escape** key, or by clicking outside it.
5. Drag the handle (⠿) on any project row to reorder.
6. Click **✏️** to reopen the modal for an existing project.
7. Click **×** on the row to delete a project.

---

## Themes

Go to the **Theme** section.

- **Preset buttons** instantly apply a coordinated light + dark palette.
- The **Light / Dark toggle** switches which set of tokens you're editing.
- Click any colour swatch to open a colour picker and override that token.
- Changes are reflected in the live preview immediately.

Available preset palettes: Indigo, Emerald, Rose, Slate.

---

## Saving and Importing Your Data

### Export (Save)

Click **Save JSON** in the top bar at any time. This downloads a `portfolio.json` file containing all your content. Keep this file — it is the only way to restore your work if `localStorage` is cleared.

### Import

Click **Import** in the top bar and select a previously exported `portfolio.json`. This replaces the current content in the editor and saves it to `localStorage`.

> **Tip:** Export before making large changes. There is no undo history.

---

## Building and Deploying

No command-line tools needed. The builder generates a complete, ready-to-host website for you.

### Download your site

1. Click **Export** in the top bar (or navigate to the Export page).
2. Click **⬇ Download ZIP** — the builder generates every HTML page, your CSS, and a favicon, then packages them as `portfolio-site.zip`.

### Deploy to Netlify Drop (easiest)

1. Unzip `portfolio-site.zip` on your computer.
2. Open **[app.netlify.com/drop](https://app.netlify.com/drop)**.
3. Drag the unzipped folder onto the page.
4. Netlify gives you a live URL instantly — no account required for a temporary link.

### Deploy to GitHub + Vercel / Cloudflare Pages

1. Unzip `portfolio-site.zip`.
2. Push the unzipped folder to a new GitHub repository.
3. Connect the repo in [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com).
4. Set the **publish directory** to the repo root (no build command needed — the HTML is already built).
5. Every push to `main` triggers a new deploy automatically.

> **One-click auto-deploy** (GitHub + Netlify/Vercel integration directly from the builder) is coming soon.

---

## Re-editing Your Portfolio Later

Your `portfolio.json` export is the source of truth for re-editing.

1. Open the builder (`npm run dev`).
2. Click **Import** and load your `portfolio.json`.
3. Make changes.
4. Click **Save JSON** to download the updated file.
5. Re-deploy (drag new `dist/` to Netlify Drop, or push to trigger CI).

---

## Keyboard & Accessibility

| Action | Shortcut |
|--------|----------|
| Close project modal | `Escape` |
| Cycle focus within modal | `Tab` / `Shift+Tab` |
| Move drag-drop item up | `Space` to pick up, `↑` arrow key |
| Move drag-drop item down | `Space` to pick up, `↓` arrow key |
| Drop item | `Space` or `Enter` |
| Cancel drag | `Escape` |

On mobile and tablet, drag items with a **200 ms long-press** to distinguish from scrolling. The project edit modal slides up as a bottom sheet on small screens.

On tablet (640–1023 px), click the **☰** hamburger button to open the slide-over editor panel.
