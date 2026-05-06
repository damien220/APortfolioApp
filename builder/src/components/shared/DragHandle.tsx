import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { DraggableAttributes } from '@dnd-kit/core';

interface Props {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}

export function DragHandle({ listeners, attributes }: Props) {
  return (
    <button
      className="drag-handle"
      {...listeners}
      {...attributes}
      aria-label="Drag to reorder"
      type="button"
    >
      ⠿
    </button>
  );
}
