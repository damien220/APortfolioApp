import { useNavigate } from 'react-router-dom';
import './HelpPage.css';

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <main className="help-page">
      <div className="help-container">
        <div className="help-topbar">
          <button className="help-back-btn" onClick={() => navigate('/builder')}>
            ← Back to Editor
          </button>
        </div>

        <h1 className="help-heading">User Guide</h1>
        <p className="help-intro">
          APortfolioApp is a visual builder for the APortfolio static site. Everything happens in
          your browser — your data stays on your device and is auto-saved after every edit.
        </p>

        <section className="help-section">
          <h2>Getting Started</h2>
          <ol className="help-steps">
            <li>Fill in your details in the left panel — start with <strong>Site</strong> and <strong>Hero</strong></li>
            <li>Add your projects under <strong>Projects</strong></li>
            <li>Adjust colours under <strong>Theme</strong></li>
            <li>Watch the <strong>Preview</strong> update in real time on the right</li>
            <li>Click <strong>Export</strong> to download your ready-to-deploy portfolio ZIP</li>
          </ol>
        </section>

        <section className="help-section">
          <h2>Editor Sections</h2>
          <dl className="help-glossary">
            <dt>Site</dt>
            <dd>Your site URL, browser tab title, and SEO description</dd>
            <dt>Hero</dt>
            <dd>Your name, tagline, and portrait photo — the first thing visitors see</dd>
            <dt>About</dt>
            <dd>A short bio paragraph about you</dd>
            <dt>Skills</dt>
            <dd>Technology categories with chip items (e.g. Languages: TypeScript, Python…). Drag to reorder categories</dd>
            <dt>Projects</dt>
            <dd>Your portfolio projects — drag to reorder, click the pencil icon to edit details</dd>
            <dt>Social</dt>
            <dd>Links to your GitHub, LinkedIn, Twitter, and other profiles, shown in the site footer</dd>
            <dt>Navigation</dt>
            <dd>The menu links shown in the site header — drag to reorder</dd>
            <dt>Contact</dt>
            <dd>The contact form intro text and your Formspree form ID</dd>
            <dt>Theme</dt>
            <dd>Colour palette for light and dark modes — choose a preset or customise every colour</dd>
            <dt>Images</dt>
            <dd>Upload a portrait photo and project screenshots</dd>
          </dl>
        </section>

        <section className="help-section">
          <h2>How to Add a Project Later</h2>
          <p className="help-body">
            Your work is auto-saved in this browser. To continue editing on a different device:
          </p>
          <ol className="help-steps">
            <li>Open APortfolioApp in your browser</li>
            <li>Click <strong>Import</strong> and select the <code>portfolio-data.json</code> file you saved from a previous export</li>
            <li>The full editor reopens with all your existing data</li>
            <li>Add or update anything you like</li>
            <li>Click <strong>Export</strong> to download a new ZIP and updated JSON</li>
            <li>Drag the new ZIP onto Netlify (or your host) — site updates in ~30 seconds</li>
          </ol>
        </section>

        <section className="help-section">
          <h2>Deploying Your Portfolio</h2>

          <h3>Easiest — Netlify Drop</h3>
          <ol className="help-steps">
            <li>Export your portfolio (click Export → Download ZIP)</li>
            <li>Unzip the downloaded file</li>
            <li>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer">app.netlify.com/drop</a></li>
            <li>Drag the unzipped folder onto the page</li>
            <li>Your site is live — Netlify gives you a URL instantly</li>
          </ol>

          <h3>GitHub + Vercel or Cloudflare Pages</h3>
          <ol className="help-steps">
            <li>Create a new GitHub repository</li>
            <li>Push the unzipped portfolio folder to it</li>
            <li>Import the repo in Vercel or Cloudflare Pages</li>
            <li>Every future push automatically redeploys</li>
          </ol>

          <h3>Build Locally</h3>
          <pre className="help-code">{`npm install\nnpm run build\n# upload dist/ to any static host`}</pre>
        </section>

        <section className="help-section">
          <h2>Saving &amp; Importing</h2>
          <ul className="help-list">
            <li>Your work is <strong>auto-saved</strong> to your browser's local storage after every edit</li>
            <li>Click <strong>Save</strong> to force-save immediately</li>
            <li>Click <strong>Import</strong> to load a previously exported <code>portfolio-data.json</code></li>
            <li>Every export ZIP includes a <code>portfolio-data.json</code> — keep it as your backup</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
