import { useFilterStore } from '../../filters/filterStore';
import { TOPIC_FILTERS } from '../types';

// Đọc và ghi trực tiếp vào Zustand store.
export default function WorkshopFilters() {
  const searchTerm = useFilterStore((state) => state.searchTerm);
  const selectedTopic = useFilterStore((state) => state.selectedTopic);
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm);
  const setSelectedTopic = useFilterStore((state) => state.setSelectedTopic);

  return (
    <section className="filters" aria-label="Tìm kiếm và lọc workshop">
      <label className="filters__search">
        <span>Tìm kiếm</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tên workshop hoặc diễn giả"
        />
      </label>

      <div className="filters__topics" role="group" aria-label="Lọc theo chủ đề">
        {TOPIC_FILTERS.map((topic) => (
          <button
            key={topic}
            type="button"
            className={topic === selectedTopic ? 'chip chip--active' : 'chip'}
            aria-pressed={topic === selectedTopic}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </section>
  );
}
