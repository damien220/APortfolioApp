import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePortfolioStore } from '../../state/store';
import type { Project } from '../../state/schema';
import { DragHandle } from '../shared/DragHandle';
import ProjectModal from './ProjectModal';
import '../shared/DragHandle.css';
import './ProjectsEditor.css';

interface SortableProjectProps {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableProject({ project, onEdit, onDelete }: SortableProjectProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="project-row">
      <DragHandle listeners={listeners} attributes={attributes} />
      <div className="project-row-info">
        <span className="project-row-title">{project.title}</span>
        <span className="project-row-type">{project.type}</span>
        {project.featured && <span className="project-row-featured">Featured</span>}
      </div>
      <div className="project-row-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onEdit(project.id)}
          aria-label={`Edit ${project.title}`}
        >
          ✏️
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(project.id)}
          aria-label={`Delete ${project.title}`}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function ProjectsEditor() {
  const { projects, addProject, removeProject, setProjects } = usePortfolioStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = projects.findIndex((p) => p.id === active.id);
    const newIdx = projects.findIndex((p) => p.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      setProjects(arrayMove(projects, oldIdx, newIdx));
    }
  }

  function handleAdd() {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: 'New Project',
      type: 'Web App',
      description: '',
      tags: [],
      date: new Date().toISOString().slice(0, 7),
      featured: false,
    };
    addProject(newProject);
    setEditingId(newProject.id);
  }

  return (
    <div className="projects-editor">
      <p className="editor-hint">Drag to reorder. Click ✏️ to edit a project's details.</p>
      <button type="button" className="add-btn" onClick={handleAdd}>
        + Add Project
      </button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {projects.map((p) => (
            <SortableProject
              key={p.id}
              project={p}
              onEdit={setEditingId}
              onDelete={removeProject}
            />
          ))}
        </SortableContext>
      </DndContext>
      {projects.length === 0 && (
        <p className="projects-empty">No projects yet. Click "+ Add Project" to get started.</p>
      )}
      {editingId && (
        <ProjectModal projectId={editingId} onClose={() => setEditingId(null)} />
      )}
    </div>
  );
}
