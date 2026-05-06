import './PreviewHero.css';

interface Props {
  name: string;
  tagline: string;
  subtitle: string;
  portrait: string;
}

export default function PreviewHero({ name, tagline, subtitle, portrait }: Props) {
  return (
    <section className="pv-hero">
      <div className="container">
        <div className="pv-hero-inner">
          <div className="pv-hero-portrait">
            {portrait ? (
              <img src={portrait} alt={`Portrait of ${name}`} className="pv-portrait-img" />
            ) : (
              <div className="pv-portrait-placeholder" aria-hidden="true">
                {name.charAt(0) || '?'}
              </div>
            )}
          </div>
          <div className="pv-hero-content">
            <p className="pv-hero-greeting">Hi, I'm</p>
            <h1 className="pv-hero-name">{name}</h1>
            <p className="pv-hero-tagline">{tagline}</p>
            {subtitle && <p className="pv-hero-subtitle">{subtitle}</p>}
            <div className="pv-hero-actions">
              <span className="pv-btn pv-btn-primary">View Projects</span>
              <span className="pv-btn pv-btn-outline">Get in Touch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
