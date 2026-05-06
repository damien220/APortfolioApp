import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../state/store';
import { PortfolioStateSchema } from '../state/schema';
import { exportPortfolio } from '../lib/exporter';
import './ExportPage.css';

export default function ExportPage() {
  const navigate = useNavigate();
  const store = usePortfolioStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    const parsed = PortfolioStateSchema.safeParse(store);
    if (!parsed.success) {
      setError('Some fields are invalid. Please fix them in the editor before exporting.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await exportPortfolio(parsed.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="export-page">
      <div className="export-container">
        <h1 className="export-heading">Export Your Portfolio</h1>
        <p className="export-intro">
          Download your portfolio as a ready-to-deploy ZIP. Then follow one of the steps below to publish it.
        </p>

        {error && <p className="export-error">{error}</p>}

        <button
          className="export-download-btn"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? 'Building ZIP…' : '⬇ Download ZIP'}
        </button>

        <div className="deploy-cards">
          <div className="deploy-card deploy-card--highlight">
            <h2 className="deploy-card-title">Easiest — Netlify Drop</h2>
            <p className="deploy-card-body">
              Unzip the file, then drag the folder onto Netlify Drop — your site is live in seconds. No account needed for a temporary URL.
            </p>
            <ol className="deploy-card-steps">
              <li>Unzip <code>portfolio-site.zip</code></li>
              <li>Drag the folder to Netlify Drop</li>
              <li>Copy the live URL Netlify gives you</li>
            </ol>
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noopener noreferrer"
              className="deploy-card-link"
            >
              Open Netlify Drop →
            </a>
          </div>

          <div className="deploy-card">
            <h2 className="deploy-card-title">GitHub + Vercel / Cloudflare</h2>
            <p className="deploy-card-body">
              Unzip, push to GitHub, then connect Vercel or Cloudflare Pages for automatic deploys on every push.
            </p>
            <ol className="deploy-card-steps">
              <li>Unzip <code>portfolio-site.zip</code></li>
              <li>Push the folder to a new GitHub repo</li>
              <li>Import the repo in Vercel or Cloudflare Pages</li>
              <li>Set the root directory as the publish directory</li>
            </ol>
          </div>

          <div className="deploy-card deploy-card--muted">
            <h2 className="deploy-card-title">One-click Auto-deploy</h2>
            <p className="deploy-card-body">
              Direct integration with GitHub + Netlify/Vercel — push a button and your portfolio deploys automatically.
            </p>
            <p className="deploy-card-coming-soon">Coming soon</p>
          </div>
        </div>

        <p className="export-note">
          The ZIP also includes <code>portfolio-data.json</code> — keep this file to re-edit your portfolio later.
          Click <strong>Import</strong> in the builder to restore your data.
        </p>

        <button className="export-back-btn" onClick={() => navigate('/builder')}>
          ← Back to Editor
        </button>
      </div>
    </main>
  );
}
