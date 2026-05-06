import type { Project } from '../../state/schema';
import PreviewProjectCard from './PreviewProjectCard';
import './PreviewProjectGrid.css';

interface Props {
  projects: Project[];
}

export default function PreviewProjectGrid({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <p className="pv-no-projects">
        No projects yet — add one in the Projects section.
      </p>
    );
  }

  return (
    <div className="pv-project-grid">
      {projects.map((p) => (
        <PreviewProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
