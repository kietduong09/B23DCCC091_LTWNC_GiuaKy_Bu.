import type { Workshop } from '../features/workshops/types';

export const MOCK_WORKSHOPS: readonly Readonly<Workshop>[] = [
  { id: 1, name: 'React cơ bản cho người mới', speaker: 'Nguyễn Minh Khoa', topic: 'Lập trình', date: '2026-11-10', totalSeats: 20, remainingSeats: 20 },
  { id: 2, name: 'TypeScript trong dự án thực tế', speaker: 'Trần Thu Hà', topic: 'Lập trình', date: '2026-11-12', totalSeats: 30, remainingSeats: 12 },
  { id: 3, name: 'Giới thiệu Machine Learning', speaker: 'Lê Quang Huy', topic: 'AI', date: '2026-11-15', totalSeats: 25, remainingSeats: 25 },
  { id: 4, name: 'Ứng dụng ChatGPT trong học tập', speaker: 'Phạm Ngọc Anh', topic: 'AI', date: '2026-11-18', totalSeats: 40, remainingSeats: 0 },
  { id: 5, name: 'Kỹ năng thuyết trình hiệu quả', speaker: 'Đỗ Thanh Mai', topic: 'Kỹ năng mềm', date: '2026-11-20', totalSeats: 35, remainingSeats: 20 },
  { id: 6, name: 'Git và GitHub cho làm việc nhóm', speaker: 'Vũ Đức Anh', topic: 'Lập trình', date: '2026-11-22', totalSeats: 30, remainingSeats: 1 },
  { id: 7, name: 'Prompt Engineering cơ bản', speaker: 'Hoàng Gia Bảo', topic: 'AI', date: '2026-11-25', totalSeats: 30, remainingSeats: 15 },
  { id: 8, name: 'Quản lý thời gian cho sinh viên', speaker: 'Nguyễn Thị Lan', topic: 'Kỹ năng mềm', date: '2026-11-27', totalSeats: 50, remainingSeats: 30 },
  { id: 9, name: 'Xây dựng REST API với Node.js', speaker: 'Bùi Văn Long', topic: 'Lập trình', date: '2026-12-02', totalSeats: 20, remainingSeats: 0 },
  { id: 10, name: 'Làm việc nhóm và giải quyết xung đột', speaker: 'Trịnh Hải Yến', topic: 'Kỹ năng mềm', date: '2026-12-05', totalSeats: 25, remainingSeats: 8 },
  { id: 11, name: 'Thị giác máy tính với Python', speaker: 'Lê Quang Huy', topic: 'AI', date: '2026-12-08', totalSeats: 20, remainingSeats: 20 },
];
