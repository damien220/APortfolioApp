import type { SkillCategory } from '../../state/schema';
import './PreviewAbout.css';

interface Props {
  bio: string;
  skills: SkillCategory[];
}

export default function PreviewAbout({ bio, skills }: Props) {
  return (
    <section className="pv-about section">
      <div className="container">
        <h2 className="section-title">About</h2>
        <p className="pv-about-bio">{bio}</p>
        {skills.length > 0 && (
          <div className="pv-skills-grid">
            {skills.map((cat) => (
              <div key={cat.title} className="pv-skill-card">
                <h3 className="pv-skill-card-title">{cat.title}</h3>
                <div className="pv-skill-chips">
                  {cat.items.map((item) => (
                    <span key={item} className="pv-skill-chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
