import { useMemo } from 'react';
import { formatDate } from '../workshopUtils';
import { MAX_REGISTRATIONS } from '../types';
import type { Workshop } from '../types';

interface RegisteredSummaryProps {
  workshops: Workshop[];
  registeredIds: number[];
}

// Danh sách ngắn các workshop sinh viên đang đăng ký (kể cả khi đang bị lọc ẩn khỏi danh sách chính).
export default function RegisteredSummary({ workshops, registeredIds }: RegisteredSummaryProps) {
  const registered = useMemo(
    () => workshops.filter((workshop) => registeredIds.includes(workshop.id)),
    [workshops, registeredIds],
  );

  return (
    <section className="summary" aria-label="Workshop đã đăng ký">
      <h2 className="summary__title">
        Đã đăng ký: {registered.length}/{MAX_REGISTRATIONS}
      </h2>
      {registered.length === 0 ? (
        <p className="summary__empty">Bạn chưa đăng ký workshop nào.</p>
      ) : (
        <ul className="summary__list">
          {registered.map((workshop) => (
            <li key={workshop.id}>
              {workshop.name} ({formatDate(workshop.date)})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
