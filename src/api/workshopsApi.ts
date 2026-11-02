import type { ApiResponse } from '../types/api';
import type { Workshop } from '../features/workshops/types';
import { MOCK_WORKSHOPS } from './mockWorkshops';

export interface FetchWorkshopsOptions {
  simulateError: boolean; 
  delayMs: number; 
}

const DEFAULT_DELAY_MS = 500;

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


export function fetchWorkshops(
  options: Partial<FetchWorkshopsOptions> = {},
): Promise<ApiResponse<Workshop[]>> {
  const { simulateError = false, delayMs = DEFAULT_DELAY_MS } = options;
  return mockRequest(() => MOCK_WORKSHOPS.map((workshop) => ({ ...workshop })), simulateError, delayMs);
}
