import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { clearNotice } from '../workshopsSlice';

const AUTO_HIDE_MS = 4000;

// Hiển thị thông báo đăng ký / huỷ / bị từ chối ngay trên giao diện.
export default function NoticeBanner() {
  const dispatch = useAppDispatch();
  const notice = useAppSelector((state) => state.workshops.notice);

  // Mỗi thông báo mới là một object mới nên timer được đặt lại.
  useEffect(() => {
    if (notice === null) return;
    const timeoutId = setTimeout(() => dispatch(clearNotice()), AUTO_HIDE_MS);
    return () => clearTimeout(timeoutId);
  }, [notice, dispatch]);

  if (notice === null) return null;

  return (
    <div
      className={`notice notice--${notice.type}`}
      role={notice.type === 'error' ? 'alert' : 'status'}
    >
      <span>{notice.message}</span>
      <button type="button" className="notice__close" onClick={() => dispatch(clearNotice())}>
        Đóng
      </button>
    </div>
  );
}
