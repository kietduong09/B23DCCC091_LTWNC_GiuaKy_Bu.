import WorkshopItem from './WorkshopItem';
import type { Workshop } from '../types';

interface WorkshopListProps {
  workshops: Workshop[];
  registeredIds: number[];
  onRegister: (workshopId: number) => void;
  onCancel: (workshopId: number) => void;
}

export default function WorkshopList({ workshops, registeredIds, onRegister, onCancel }: WorkshopListProps) {
  return (
    <ul className="workshop-list">
      {workshops.map((workshop) => (
        // key theo ID ổn định, không dùng index
        <li key={workshop.id}>
          <WorkshopItem
            workshop={workshop}
            isRegistered={registeredIds.includes(workshop.id)}
            onRegister={onRegister}
            onCancel={onCancel}
          />
        </li>
      ))}
    </ul>
  );
}
