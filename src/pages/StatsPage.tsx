import { useMemo } from 'react';
import { useAppSelector } from '../app/hooks';
import LoadingMessage from '../components/common/LoadingMessage';
import { countByTopic } from '../features/workshops/workshopUtils';
import { MAX_REGISTRATIONS, WORKSHOP_TOPICS } from '../features/workshops/types';

// Trang này được lazy load (xem routes/AppRoutes.tsx) nên dùng export default.
export default function StatsPage() {
  const { items, registeredIds, status, error } = useAppSelector((state) => state.workshops);

  // Số liệu tính trực tiếp từ state Redux, không hardcode.
  const topicCounts = useMemo(() => countByTopic(items), [items]);

  if (status === 'idle' || status === 'loading') {
    return <LoadingMessage />;
  }

  if (status === 'failed') {
    return (
      <p className="state-message state-message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <>
      <h1>Thống kê</h1>

      <section className="stats">
        <h2>Số workshop theo chủ đề</h2>
        <table className="stats__table">
          <thead>
            <tr>
              <th scope="col">Chủ đề</th>
              <th scope="col">Số workshop</th>
            </tr>
          </thead>
          <tbody>
            {WORKSHOP_TOPICS.map((topic) => (
              <tr key={topic}>
                <th scope="row">{topic}</th>
                <td>{topicCounts[topic]}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Tổng cộng</th>
              <td>{items.length}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <section className="stats">
        <h2>Đăng ký của bạn</h2>
        <p>
          Số workshop đang đăng ký:{' '}
          <strong>
            {registeredIds.length}/{MAX_REGISTRATIONS}
          </strong>
        </p>
      </section>
    </>
  );
}
