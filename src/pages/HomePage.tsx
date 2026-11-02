import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import LoadingMessage from '../components/common/LoadingMessage';
import { useFilterStore } from '../features/filters/filterStore';
import NoticeBanner from '../features/workshops/components/NoticeBanner';
import RegisteredSummary from '../features/workshops/components/RegisteredSummary';
import WorkshopFilters from '../features/workshops/components/WorkshopFilters';
import WorkshopList from '../features/workshops/components/WorkshopList';
import { cancelRegistration, loadWorkshops, registerWorkshop } from '../features/workshops/workshopsSlice';
import { filterWorkshops } from '../features/workshops/workshopUtils';
import { useDebounce } from '../hooks/useDebounce';

const SEARCH_DEBOUNCE_MS = 300;

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, registeredIds, status, error } = useAppSelector((state) => state.workshops);
  const searchTerm = useFilterStore((state) => state.searchTerm);
  const selectedTopic = useFilterStore((state) => state.selectedTopic);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  // Chỉ lọc theo từ khóa sau khi người dùng ngừng gõ 300ms.
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

  // useMemo: chỉ tính lại danh sách khi dữ liệu hoặc bộ lọc thay đổi.
  const filteredWorkshops = useMemo(
    () => filterWorkshops(items, debouncedSearchTerm, selectedTopic),
    [items, debouncedSearchTerm, selectedTopic],
  );

  // useCallback: giữ nguyên tham chiếu hàm để WorkshopItem (React.memo) không render lại vô ích.
  const handleRegister = useCallback(
    (workshopId: number) => {
      dispatch(registerWorkshop(workshopId));
    },
    [dispatch],
  );

  const handleCancel = useCallback(
    (workshopId: number) => {
      dispatch(cancelRegistration(workshopId));
    },
    [dispatch],
  );

  // Thử tải lại (không giả lập lỗi).
  const handleRetry = useCallback(() => {
    void dispatch(loadWorkshops());
  }, [dispatch]);

  function renderContent() {
    if (status === 'idle' || status === 'loading') {
      return <LoadingMessage />;
    }

    if (status === 'failed') {
      return (
        <div className="state-message state-message--error" role="alert">
          <p>{error}</p>
          <button type="button" className="button button--primary" onClick={handleRetry}>
            Thử tải lại
          </button>
        </div>
      );
    }

    if (filteredWorkshops.length === 0) {
      return (
        <div className="state-message">
          <p>Không tìm thấy workshop phù hợp.</p>
          <button type="button" className="button button--outline" onClick={resetFilters}>
            Xoá bộ lọc
          </button>
        </div>
      );
    }

    return (
      <WorkshopList
        workshops={filteredWorkshops}
        registeredIds={registeredIds}
        onRegister={handleRegister}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <>
      <h1>Danh sách workshop</h1>
      <NoticeBanner />
      <RegisteredSummary workshops={items} registeredIds={registeredIds} />
      <WorkshopFilters />
      {renderContent()}
    </>
  );
}
