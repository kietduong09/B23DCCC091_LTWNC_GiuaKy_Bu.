import { MOCK_WORKSHOPS } from '../../api/mockWorkshops';
import { countByTopic, filterWorkshops, formatDate } from './workshopUtils';

const workshops = MOCK_WORKSHOPS.map((workshop) => ({ ...workshop }));

describe('filterWorkshops', () => {
  it('tìm theo tên workshop, không phân biệt hoa thường', () => {
    const result = filterWorkshops(workshops, 'REACT', 'Tất cả');
    expect(result.map((w) => w.id)).toEqual([1]);
  });

  it('tìm theo tên diễn giả', () => {
    const result = filterWorkshops(workshops, 'lê quang huy', 'Tất cả');
    expect(result.map((w) => w.id)).toEqual([3, 11]);
  });

  it('lọc theo chủ đề', () => {
    const result = filterWorkshops(workshops, '', 'AI');
    expect(result.every((w) => w.topic === 'AI')).toBe(true);
    expect(result).toHaveLength(4);
  });

  it('kết hợp tìm kiếm và chủ đề', () => {
    expect(filterWorkshops(workshops, 'huy', 'AI').map((w) => w.id)).toEqual([3, 11]);
    expect(filterWorkshops(workshops, 'huy', 'Lập trình')).toEqual([]);
  });

  it('"Tất cả" và từ khóa rỗng trả về toàn bộ danh sách', () => {
    expect(filterWorkshops(workshops, '   ', 'Tất cả')).toHaveLength(workshops.length);
  });
});

describe('countByTopic', () => {
  it('đếm đúng số workshop theo chủ đề', () => {
    expect(countByTopic(workshops)).toEqual({ 'Lập trình': 4, AI: 4, 'Kỹ năng mềm': 3 });
  });
});

describe('formatDate', () => {
  it('đổi YYYY-MM-DD thành DD/MM/YYYY', () => {
    expect(formatDate('2026-11-10')).toBe('10/11/2026');
  });
});
