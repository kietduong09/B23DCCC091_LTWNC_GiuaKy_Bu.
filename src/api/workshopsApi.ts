import type { ApiResponse } from '../types/api';
import type { Workshop } from '../features/workshops/types';
import { MOCK_WORKSHOPS } from './mockWorkshops';

export interface FetchWorkshopsOptions {
  simulateError: boolean; // true: giả lập API bị lỗi
  delayMs: number; // độ trễ giả lập
}

const DEFAULT_DELAY_MS = 500;

// Hàm generic dùng chung cho API giả lập: chờ delayMs rồi trả về thành công hoặc thất bại.
function mockRequest<T>(
  getData: () => T,
  simulateError: boolean,
  delayMs: number,
): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (simulateError) {
        resolve({ ok: false, error: 'Không thể tải danh sách workshop. Vui lòng thử lại.' });
      } else {
        resolve({ ok: true, data: getData() });
      }
    }, delayMs);
  });
}

// Utility type: Partial - mọi tùy chọn đều không bắt buộc.
export function fetchWorkshops(
  options: Partial<FetchWorkshopsOptions> = {},
): Promise<ApiResponse<Workshop[]>> {
  const { simulateError = false, delayMs = DEFAULT_DELAY_MS } = options;
  // Trả về bản sao để dữ liệu mẫu gốc không bị thay đổi.
  return mockRequest(() => MOCK_WORKSHOPS.map((workshop) => ({ ...workshop })), simulateError, delayMs);
}
