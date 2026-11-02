import { memo } from 'react';
import { formatDate } from '../workshopUtils';
import type { Workshop } from '../types';

interface WorkshopItemProps {
  workshop: Readonly<Workshop>;
  isRegistered: boolean;
  onRegister: (workshopId: number) => void;
  onCancel: (workshopId: number) => void;
}

// React.memo: component chỉ render lại khi props của chính workshop này thay đổi.
function WorkshopItem({ workshop, isRegistered, onRegister, onCancel }: WorkshopItemProps) {
  const isFull = workshop.remainingSeats === 0;

  let statusText = 'Còn chỗ';
  let statusClass = 'status status--open';
  if (isRegistered) {
    statusText = 'Đã đăng ký';
    statusClass = 'status status--registered';
  } else if (isFull) {
    statusText = 'Hết chỗ';
    statusClass = 'status status--full';
  }

  return (
    <article className="workshop">
      <div className="workshop__head">
        <h3 className="workshop__name">{workshop.name}</h3>
        <span className="tag">{workshop.topic}</span>
      </div>

      <dl className="workshop__info">
        <div>
          <dt>Diễn giả</dt>
          <dd>{workshop.speaker}</dd>
        </div>
        <div>
          <dt>Ngày tổ chức</dt>
          <dd>{formatDate(workshop.date)}</dd>
        </div>
        <div>
          <dt>Số chỗ</dt>
          <dd>
            Còn {workshop.remainingSeats}/{workshop.totalSeats} chỗ
          </dd>
        </div>
      </dl>

      <div className="workshop__footer">
        <span className={statusClass}>{statusText}</span>
        {isRegistered ? (
          <button type="button" className="button button--danger" onClick={() => onCancel(workshop.id)}>
            Huỷ
          </button>
        ) : (
          <button
            type="button"
            className="button button--primary"
            disabled={isFull}
            onClick={() => onRegister(workshop.id)}
          >
            Đăng ký
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(WorkshopItem);
