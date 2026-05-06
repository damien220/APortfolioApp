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
import type { SkillCategory } from '../../state/schema';
import { DragHandle } from '../shared/DragHandle';
import '../shared/DragHandle.css';
import './SkillsEditor.css';

interface SortableCategoryProps {
  category: SkillCategory;
  index: number;
  onUpdate: (index: number, updated: SkillCategory) => void;
  onRemove: (index: number) => void;
}

function SortableCategory({ category, index, onUpdate, onRemove }: SortableCategoryProps) {
  const [newSkill, setNewSkill] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `cat-${index}-${category.title}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    onUpdate(index, { ...category, items: [...category.items, trimmed] });
    setNewSkill('');
  }

  function removeSkill(skillIdx: number) {
    onUpdate(index, {
      ...category,
      items: category.items.filter((_, i) => i !== skillIdx),
    });
  }

  return (
    <div ref={setNodeRef} style={style} className="skill-category">
      <div className="skill-category-header">
        <DragHandle listeners={listeners} attributes={attributes} />
        <input
          type="text"
          className="field-input skill-title-input"
          value={category.title}
          onChange={(e) => onUpdate(index, { ...category, title: e.target.value })}
          placeholder="Category title"
          aria-label="Category title"
        />
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onRemove(index)}
          aria-label="Remove category"
        >
          ×
        </button>
      </div>
      <div className="skill-chips">
        {category.items.map((item, si) => (
          <span key={si} className="skill-chip">
            {item}
            <button
              type="button"
              className="chip-remove"
              onClick={() => removeSkill(si)}
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="skill-add-row">
        <input
          type="text"
          className="field-input"
          placeholder="Add skill…"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          aria-label="New skill name"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          onBlur={addSkill}
        />
      </div>
    </div>
  );
}

export default function SkillsEditor() {
  const { about, setSkills } = usePortfolioStore();
  const skills = about.skills;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = skills.findIndex((_, i) => `cat-${i}-${skills[i].title}` === active.id);
    const newIdx = skills.findIndex((_, i) => `cat-${i}-${skills[i].title}` === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      setSkills(arrayMove(skills, oldIdx, newIdx));
    }
  }

  function updateCategory(index: number, updated: SkillCategory) {
    const next = [...skills];
    next[index] = updated;
    setSkills(next);
  }

  function removeCategory(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  function addCategory() {
    setSkills([...skills, { title: 'New Category', items: [] }]);
  }

  return (
    <div className="skills-editor">
      <p className="editor-hint">Group your technologies into categories. Drag to reorder.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={skills.map((_, i) => `cat-${i}-${skills[i].title}`)}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((cat, i) => (
            <SortableCategory
              key={`${i}-${cat.title}`}
              category={cat}
              index={i}
              onUpdate={updateCategory}
              onRemove={removeCategory}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button type="button" className="add-btn" onClick={addCategory}>
        + Add Category
      </button>
    </div>
  );
}
