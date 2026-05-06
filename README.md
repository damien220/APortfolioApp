# APortfolioApp

**A visual portfolio builder — a companion tool for [APortfolio](https://github.com/damien220/APortfolio).**

No code. No terminal. No excuses.

---

## What is this?

APortfolioApp is a browser-based builder that lets anyone create a professional portfolio website in minutes — without writing a single line of code.

It is built as a companion to **APortfolio**, a clean and modern portfolio site template. APortfolio was great for developers who could clone a repo and edit config files — but that left everyone else behind. APortfolioApp fixes that: it puts the full power of APortfolio behind a simple, visual editor that anyone can use.

Fill in your details, upload your photos, add your projects, pick your colors, and click **Export**. You get a ready-to-publish website — a real set of HTML pages — that you can put online in minutes.

---

## Why use it?

There is no reason left to not have a portfolio.

Whether you are a designer, a student, a writer, a developer, or just someone who wants a corner of the internet to call their own — you no longer need to know how to code, hire a developer, or pay for a website builder subscription. Open the app, spend 15 minutes filling in your information, and you have a portfolio ready to share.

- **Free.** No subscription, no account required.
- **Private.** Everything stays in your browser — nothing is uploaded to any server.
- **Yours.** The export is plain HTML and CSS — no platform lock-in, no monthly fees, host it anywhere.
- **Fast.** A complete portfolio in under 20 minutes, start to finish.

---

## What you get

When you click Export, you download a ZIP file containing a complete, ready-to-publish website:

- A home page with your name, tagline, portrait, bio, and skills
- A projects page with cards for each of your projects
- Individual project detail pages with descriptions and images
- An about page and a contact page
- Light and dark mode, with the color theme you chose
- All your images included — no external links needed

Unzip it, drag the folder onto [Netlify Drop](https://app.netlify.com/drop) (or any similar service), and your portfolio is live.

---

## How to use it

### 1. Open the app

Go to the APortfolioApp URL in your browser. You will see a welcome screen with two options:

- **Start from scratch** — blank slate, fill in everything yourself
- **Load sample** — see a pre-filled example to get a feel for the app before editing

### 2. Fill in your details

The left panel has sections you can open and edit one at a time:

| Section      | What to fill in                                                         |
| ------------ | ----------------------------------------------------------------------- |
| **Site**     | Your site's title and description (used by search engines)              |
| **Hero**     | Your name, tagline, and a short subtitle shown at the top of your page  |
| **About**    | A bio paragraph that tells visitors who you are                         |
| **Skills**   | Your areas of expertise, grouped by category (e.g. "Design", "Tools")   |
| **Projects** | Your work — title, description, image, links, and tags for each project |
| **Social**   | Links to your GitHub, LinkedIn, Twitter, email, or any other profile    |
| **Contact**  | A short intro message shown above the contact form                      |
| **Theme**    | Colors for your site — pick from presets or choose your own             |
| **Images**   | Upload images to use as thumbnails in project cards                     |

The right side shows a **live preview** that updates as you type. Switch between desktop and mobile views to see how your portfolio will look on different devices.

### 3. Add your projects

Open the **Projects** section and click **+ Add Project**. A form opens where you can fill in:

- Title and description
- An image (upload a screenshot or photo)
- Tags (pick from your skills or type your own)
- Links to a live demo and the source code repository
- A date and a longer write-up (supports Markdown formatting)

You can drag projects to reorder them. Mark your best work as **Featured** to highlight it on the home page.

### 4. Choose your colors

Open **Theme** and either pick a preset (Ocean, Sunset, Forest, Midnight, etc.) or use the color pickers to set your own. The preview updates instantly so you can see exactly what your site will look like.

### 5. Export your portfolio

Click **Export** in the top bar. Review the summary and click **Download ZIP**. You will get a file called `portfolio-site.zip`.

### 6. Publish it online

1. Unzip `portfolio-site.zip` on your computer.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the unzipped folder into the Netlify Drop area.
4. Netlify gives you a live URL in seconds — share it anywhere.

That's it. Your portfolio is online.

> **Tip:** Want to edit your portfolio later? On the Export page, also download `portfolio-data.json`. Keep this file safe — it's your "save file". Next time you open APortfolioApp, click **Import** and select that file to pick up exactly where you left off.

> **Tip:** Signup for Netlify to make you page permanent. Free users get one hour for access to the generated URL. (Netlify generates a password to access it, make sure to copy it).

---

## Starting fresh

If you want to discard your current work and start over, click **New** in the top bar. You will be asked to confirm before anything is deleted.

---

## Saving your work

Your portfolio auto-saves in your browser as you edit — you can close the tab and come back later on the same device and browser. For a permanent backup you can open on any device, use the **Export → portfolio-data.json** file described above.

---

## Deploying to other platforms

Netlify Drop is the easiest one-click option, but the exported ZIP works anywhere that serves static files:

- **Vercel** — connect your GitHub repo or drag-drop the folder
- **Cloudflare Pages** — same as Vercel, with fast global delivery
- **GitHub Pages** — free hosting tied to your GitHub account
- **Any web host** — upload the unzipped folder via FTP or the host's file manager

---

## Related

- **[APortfolio](https://github.com/damien220/APortfolio)** — the underlying portfolio template this tool is built around
