// Danh sách chủ đề khai báo bằng mảng hằng để vừa dùng để render, vừa suy ra type.
export const WORKSHOP_TOPICS = ['Lập trình', 'AI', 'Kỹ năng mềm'] as const;
export type WorkshopTopic = (typeof WORKSHOP_TOPICS)[number];

// Bộ lọc có thêm lựa chọn "Tất cả".
export const TOPIC_FILTERS = ['Tất cả', ...WORKSHOP_TOPICS] as const;
export type TopicFilter = (typeof TOPIC_FILTERS)[number];

// Mỗi sinh viên chỉ được đăng ký tối đa 3 workshop cùng lúc.
export const MAX_REGISTRATIONS = 3;

export interface Workshop {
  id: number;
  name: string;
  speaker: string;
  topic: WorkshopTopic;
  date: string; // định dạng YYYY-MM-DD
  totalSeats: number;
  remainingSeats: number;
}

// Utility type: Record - số workshop theo từng chủ đề (trang thống kê).
export type TopicCounts = Record<WorkshopTopic, number>;

// Trạng thái gọi API của danh sách workshop.
export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Lý do một lần đăng ký bị từ chối.
export type RejectReason = 'limit' | 'full' | 'duplicate';

// Utility type: Record - mỗi lý do có một thông báo hiển thị cho người dùng.
export const REJECT_MESSAGES: Record<RejectReason, string> = {
  limit: `Bạn chỉ được đăng ký tối đa ${MAX_REGISTRATIONS} workshop. Hãy huỷ một workshop trước khi đăng ký thêm.`,
  full: 'Workshop này đã hết chỗ.',
  duplicate: 'Bạn đã đăng ký workshop này rồi.',
};

export interface RegistrationRejectedPayload {
  workshopId: number;
  reason: RejectReason;
}

export interface Notice {
  type: 'success' | 'error';
  message: string;
}

export interface WorkshopsState {
  items: Workshop[];
  registeredIds: number[]; // ID các workshop sinh viên đang đăng ký
  status: LoadStatus;
  error: string | null;
  notice: Notice | null; // thông báo hiển thị sau mỗi lần đăng ký / huỷ
}
