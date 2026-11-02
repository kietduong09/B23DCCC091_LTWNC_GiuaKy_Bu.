import { create } from 'zustand';
import type { TopicFilter } from '../workshops/types';

// Zustand quản lý state bộ lọc (không đưa vào Redux).
interface FilterState {
  searchTerm: string;
  selectedTopic: TopicFilter;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedTopic: (topic: TopicFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  searchTerm: '',
  selectedTopic: 'Tất cả',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
  resetFilters: () => set({ searchTerm: '', selectedTopic: 'Tất cả' }),
}));
