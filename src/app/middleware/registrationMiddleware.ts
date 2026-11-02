import type { Middleware } from '@reduxjs/toolkit';
import { registerWorkshop, registrationRejected } from '../../features/workshops/workshopsSlice';
import { MAX_REGISTRATIONS } from '../../features/workshops/types';
import type { RootState } from '../store';

// Middleware giới hạn mỗi sinh viên chỉ đăng ký tối đa 3 workshop.
//
// Luồng hoạt động:
// 1. Mọi action đều đi qua middleware này trước khi đến reducer.
// 2. Nếu không phải action registerWorkshop -> cho đi tiếp (next).
// 3. Nếu là registerWorkshop: đọc số workshop đã đăng ký từ state hiện tại.
//    - Đã đủ 3 -> KHÔNG gọi next(action), nên reducer không bao giờ nhận được action này
//      (dữ liệu không đổi). Thay vào đó phát action registrationRejected để giao diện hiện thông báo.
//    - Chưa đủ 3 -> gọi next(action) để reducer xử lý bình thường.
export const registrationMiddleware: Middleware<object, RootState> = (storeApi) => (next) => (action) => {
  if (registerWorkshop.match(action)) {
    const { registeredIds } = storeApi.getState().workshops;
    const workshopId = action.payload;

    // Workshop đã đăng ký rồi thì để reducer báo "đăng ký trùng", không tính là vượt giới hạn.
    const isAlreadyRegistered = registeredIds.includes(workshopId);

    if (!isAlreadyRegistered && registeredIds.length >= MAX_REGISTRATIONS) {
      storeApi.dispatch(registrationRejected({ workshopId, reason: 'limit' }));
      return undefined; // chặn action
    }
  }

  return next(action);
};
