import type { TopicCounts, TopicFilter, Workshop } from './types';

// Lọc theo từ khóa (tên workshop hoặc diễn giả, không phân biệt hoa thường) và chủ đề.
export function filterWorkshops(
  workshops: Workshop[],
  searchTerm: string,
  topic: TopicFilter,
): Workshop[] {
  const keyword = searchTerm.trim().toLowerCase();

  return workshops.filter((workshop) => {
    const matchesTopic = topic === 'Tất cả' || workshop.topic === topic;
    const matchesKeyword =
      keyword === '' ||
      workshop.name.toLowerCase().includes(keyword) ||
      workshop.speaker.toLowerCase().includes(keyword);
    return matchesTopic && matchesKeyword;
  });
}

// Đếm số workshop theo từng chủ đề cho trang thống kê.
export function countByTopic(workshops: Workshop[]): TopicCounts {
  const counts: TopicCounts = { 'Lập trình': 0, AI: 0, 'Kỹ năng mềm': 0 };
  for (const workshop of workshops) {
    counts[workshop.topic] += 1;
  }
  return counts;
}

// Đổi "2026-11-10" thành "10/11/2026" (tự tách chuỗi để không bị lệch múi giờ).
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
