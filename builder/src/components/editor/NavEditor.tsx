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
import type { NavItem } from '../../state/schema';
import { DragHandle } from '../shared/DragHandle';
import '../shared/DragHandle.css';
import './NavEditor.css';

interface SortableNavRowProps {
  item: NavItem;
  index: number;
  onUpdate: (i: number, patch: Partial<NavItem>) => void;
  onRemove: (i: number) => void;
}

function SortableNavRow({ item, index, onUpdate, onRemove }: SortableNavRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `nav-${index}` });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="nav-row">
      <DragHandle listeners={listeners} attributes={attributes} />
      <input
        type="text"
        className="field-input nav-label"
        placeholder="Label"
        value={item.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        aria-label="Nav label"
      />
      <input
        type="text"
        className="field-input nav-href"
        placeholder="Href"
        value={item.href}
        onChange={(e) => onUpdate(index, { href: e.target.value })}
        aria-label="Nav href"
      />
      <button
        type="button"
        className="icon-btn icon-btn--danger"
        onClick={() => onRemove(index)}
        aria-label="Remove nav item"
      >
        ×
      </button>
    </div>
  );
}

export default function NavEditor() {
  const { nav, setNav } = usePortfolioStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = nav.findIndex((_, i) => `nav-${i}` === active.id);
    const newIdx = nav.findIndex((_, i) => `nav-${i}` === over.id);
    if (oldIdx !== -1 && newIdx !== -1) setNav(arrayMove(nav, oldIdx, newIdx));
  }

  function update(i: number, patch: Partial<NavItem>) {
    const next = [...nav];
    next[i] = { ...next[i], ...patch };
    setNav(next);
  }

  return (
    <div className="nav-editor">
      <p className="editor-hint">Menu links shown in the site header. Drag to reorder.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={nav.map((_, i) => `nav-${i}`)} strategy={verticalListSortingStrategy}>
          {nav.map((item, i) => (
            <SortableNavRow
              key={i}
              item={item}
              index={i}
              onUpdate={update}
              onRemove={(idx) => setNav(nav.filter((_, j) => j !== idx))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        className="add-btn"
        onClick={() => setNav([...nav, { label: '', href: '/' }])}
      >
        + Add Nav Item
      </button>
    </div>
  );
}
