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
import type { SocialLink, DonationLink } from '../../state/schema';
import { DragHandle } from '../shared/DragHandle';
import '../shared/DragHandle.css';
import './SocialEditor.css';

interface SortableSocialRowProps {
  link: SocialLink;
  index: number;
  onUpdate: (i: number, patch: Partial<SocialLink>) => void;
  onRemove: (i: number) => void;
}

function SortableSocialRow({ link, index, onUpdate, onRemove }: SortableSocialRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `social-${index}` });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="link-row">
      <DragHandle listeners={listeners} attributes={attributes} />
      <select
        className="field-input link-icon-select"
        value={link.icon}
        onChange={(e) => onUpdate(index, { icon: e.target.value as SocialLink['icon'] })}
        aria-label="Icon"
      >
        <option value="github">GitHub</option>
        <option value="linkedin">LinkedIn</option>
        <option value="twitter">Twitter</option>
        <option value="email">Email</option>
        <option value="website">Website</option>
      </select>
      <input
        type="text"
        className="field-input link-label"
        placeholder="Label"
        value={link.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        aria-label="Label"
      />
      <input
        type="text"
        className="field-input link-url"
        placeholder="URL"
        value={link.url}
        onChange={(e) => onUpdate(index, { url: e.target.value })}
        aria-label="URL"
      />
      <button
        type="button"
        className="icon-btn icon-btn--danger"
        onClick={() => onRemove(index)}
        aria-label="Remove link"
      >
        ×
      </button>
    </div>
  );
}

interface SortableDonationRowProps {
  link: DonationLink;
  index: number;
  onUpdate: (i: number, patch: Partial<DonationLink>) => void;
  onRemove: (i: number) => void;
}

function SortableDonationRow({ link, index, onUpdate, onRemove }: SortableDonationRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `donation-${index}` });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="link-row">
      <DragHandle listeners={listeners} attributes={attributes} />
      <select
        className="field-input link-icon-select"
        value={link.icon}
        onChange={(e) => onUpdate(index, { icon: e.target.value as DonationLink['icon'] })}
        aria-label="Icon"
      >
        <option value="patreon">Patreon</option>
        <option value="buymeacoffee">Buy Me a Coffee</option>
      </select>
      <input
        type="text"
        className="field-input link-label"
        placeholder="Label"
        value={link.label}
        onChange={(e) => onUpdate(index, { label: e.target.value })}
        aria-label="Label"
      />
      <input
        type="text"
        className="field-input link-url"
        placeholder="URL"
        value={link.url}
        onChange={(e) => onUpdate(index, { url: e.target.value })}
        aria-label="URL"
      />
      <button
        type="button"
        className="icon-btn icon-btn--danger"
        onClick={() => onRemove(index)}
        aria-label="Remove link"
      >
        ×
      </button>
    </div>
  );
}

export default function SocialEditor() {
  const { social, donations, setSocial, setDonations } = usePortfolioStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleSocialDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = social.findIndex((_, i) => `social-${i}` === active.id);
    const newIdx = social.findIndex((_, i) => `social-${i}` === over.id);
    if (oldIdx !== -1 && newIdx !== -1) setSocial(arrayMove(social, oldIdx, newIdx));
  }

  function handleDonationDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = donations.findIndex((_, i) => `donation-${i}` === active.id);
    const newIdx = donations.findIndex((_, i) => `donation-${i}` === over.id);
    if (oldIdx !== -1 && newIdx !== -1) setDonations(arrayMove(donations, oldIdx, newIdx));
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    const next = [...social];
    next[i] = { ...next[i], ...patch };
    setSocial(next);
  }

  function updateDonation(i: number, patch: Partial<DonationLink>) {
    const next = [...donations];
    next[i] = { ...next[i], ...patch };
    setDonations(next);
  }

  return (
    <div className="social-editor">
      <p className="editor-hint">Links shown in your site footer. Drag to reorder.</p>
      <h3 className="social-section-title">Social Links</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSocialDragEnd}>
        <SortableContext items={social.map((_, i) => `social-${i}`)} strategy={verticalListSortingStrategy}>
          {social.map((link, i) => (
            <SortableSocialRow
              key={i}
              link={link}
              index={i}
              onUpdate={updateSocial}
              onRemove={(idx) => setSocial(social.filter((_, j) => j !== idx))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        className="add-btn"
        onClick={() => setSocial([...social, { label: '', url: '', icon: 'github' }])}
      >
        + Add Social Link
      </button>

      <h3 className="social-section-title" style={{ marginTop: '1.25rem' }}>Donation Links</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDonationDragEnd}>
        <SortableContext items={donations.map((_, i) => `donation-${i}`)} strategy={verticalListSortingStrategy}>
          {donations.map((link, i) => (
            <SortableDonationRow
              key={i}
              link={link}
              index={i}
              onUpdate={updateDonation}
              onRemove={(idx) => setDonations(donations.filter((_, j) => j !== idx))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        className="add-btn"
        onClick={() => setDonations([...donations, { label: '', url: '', icon: 'patreon' }])}
      >
        + Add Donation Link
      </button>
    </div>
  );
}
