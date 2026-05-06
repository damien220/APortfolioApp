import { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '../../state/store';
import type { Project } from '../../state/schema';
import './ProjectModal.css';

interface Props {
  projectId: string;
  onClose: () => void;
}

export default function ProjectModal({ projectId, onClose }: Props) {
  const { projects, updateProject, about } = usePortfolioStore();
  const [tagInput, setTagInput] = useState('');
  const project = projects.find((p) => p.id === projectId);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const firstFocusable = el.querySelector<HTMLElement>(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;

      const el = dialogRef.current;
      if (!el) return;
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const allSkills = about.skills.flatMap((cat) => cat.items);

  function patch(partial: Partial<Project>) {
    updateProject(projectId, partial);
  }

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !project!.tags.includes(trimmed)) {
      patch({ tags: [...project!.tags, trimmed] });
    }
  }

  function removeTag(tag: string) {
    patch({ tags: project!.tags.filter((t) => t !== tag) });
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    } else if (e.key === 'Backspace' && tagInput === '' && project!.tags.length > 0) {
      removeTag(project!.tags[project!.tags.length - 1]);
    }
  }

  function handleTagBlur() {
    if (tagInput.trim()) {
      addTag(tagInput);
      setTagInput('');
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ image: reader.result as string });
    reader.readAsDataURL(file);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Edit Project</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div className="modal-body">
          <div className="field-group">
            <label className="field-label" htmlFor="pm-title">Title</label>
            <input
              id="pm-title"
              type="text"
              className="field-input"
              value={project.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-desc">Description</label>
            <textarea
              id="pm-desc"
              className="field-input"
              rows={3}
              value={project.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-type">Type</label>
            <select
              id="pm-type"
              className="field-input"
              value={project.type}
              onChange={(e) => patch({ type: e.target.value as Project['type'] })}
            >
              <option>Web App</option>
              <option>CLI Tool</option>
              <option>Library</option>
              <option>API</option>
              <option>Mobile App</option>
              <option>Data/ML</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Tags</label>
            <div className="pm-tags-box">
              {project.tags.map((tag) => (
                <span key={tag} className="pm-tag-chip">
                  {tag}
                  <button
                    type="button"
                    className="pm-tag-remove"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >×</button>
                </span>
              ))}
              <input
                type="text"
                className="pm-tag-input"
                placeholder={project.tags.length === 0 ? 'Type a tag, press Enter or ,' : ''}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagBlur}
                aria-label="Add tag"
              />
            </div>
            {allSkills.filter((s) => !project.tags.includes(s)).length > 0 && (
              <div className="pm-skills-picker">
                <span className="pm-skills-hint">Pick from your skills:</span>
                {allSkills
                  .filter((s) => !project.tags.includes(s))
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="pm-skill-chip"
                      onClick={() => addTag(skill)}
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div className="field-group field-group--inline">
            <label className="field-label field-label--inline" htmlFor="pm-featured">
              <input
                id="pm-featured"
                type="checkbox"
                checked={project.featured}
                onChange={(e) => patch({ featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-image">Image</label>
            <input
              id="pm-image"
              type="file"
              accept="image/*"
              capture="environment"
              className="field-input"
              onChange={handleImageChange}
            />
            {project.image && (
              <img src={project.image} alt="Preview" className="pm-img-preview" />
            )}
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-live">Live URL</label>
            <input
              id="pm-live"
              type="url"
              className="field-input"
              value={project.liveUrl ?? ''}
              onChange={(e) => patch({ liveUrl: e.target.value || undefined })}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-repo">Repo URL</label>
            <input
              id="pm-repo"
              type="url"
              className="field-input"
              value={project.repoUrl ?? ''}
              onChange={(e) => patch({ repoUrl: e.target.value || undefined })}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-date">Date</label>
            <input
              id="pm-date"
              type="month"
              className="field-input"
              value={project.date}
              onChange={(e) => patch({ date: e.target.value })}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="pm-body">Content (Markdown)</label>
            <textarea
              id="pm-body"
              className="field-input"
              rows={10}
              placeholder="Markdown content for the project page"
              value={project.body ?? ''}
              onChange={(e) => patch({ body: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
