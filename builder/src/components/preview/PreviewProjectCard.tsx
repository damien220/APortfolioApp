import type { Project } from '../../state/schema';
import './PreviewProjectCard.css';

interface Props {
  project: Project;
}

export default function PreviewProjectCard({ project }: Props) {
  const { title, description, type, tags, image, featured } = project;

  return (
    <article className={`pv-project-card${featured ? ' featured' : ''}`}>
      <div className="pv-card-image">
        {image ? (
          <img src={image} alt={`Screenshot of ${title}`} />
        ) : (
          <div className="pv-card-image-placeholder">
            <span>{title[0] ?? '?'}</span>
          </div>
        )}
      </div>
      <div className="pv-card-content">
        <span className="pv-card-type">{type}</span>
        <h3 className="pv-card-title">{title}</h3>
        <p className="pv-card-description">{description}</p>
        <div className="pv-card-tags">
          {tags.map((tag) => (
            <span key={tag} className="pv-tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
