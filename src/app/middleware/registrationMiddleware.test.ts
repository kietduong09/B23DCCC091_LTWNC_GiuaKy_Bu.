import { createAppStore } from '../store';
import { cancelRegistration, loadWorkshops, registerWorkshop } from '../../features/workshops/workshopsSlice';
import { REJECT_MESSAGES } from '../../features/workshops/types';
import type { Workshop } from '../../features/workshops/types';

function createWorkshops(count: number): Workshop[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Workshop ${index + 1}`,
    speaker: 'Diễn giả',
    topic: 'Lập trình' as const,
    date: '2026-11-10',
    totalSeats: 10,
    remainingSeats: 10,
  }));
}

// Tạo store thật (có middleware) và nạp sẵn 5 workshop.
function createLoadedStore() {
  const store = createAppStore();
  store.dispatch(loadWorkshops.fulfilled(createWorkshops(5), 'req-1', undefined));
  return store;
}

describe('registrationMiddleware', () => {
  it('cho phép đăng ký khi chưa đủ 3 workshop', () => {
    const store = createLoadedStore();
    store.dispatch(registerWorkshop(1));
    store.dispatch(registerWorkshop(2));
    store.dispatch(registerWorkshop(3));

    expect(store.getState().workshops.registeredIds).toEqual([1, 2, 3]);
  });

  it('chặn workshop thứ 4: dữ liệu không đổi và có thông báo lỗi', () => {
    const store = createLoadedStore();
    store.dispatch(registerWorkshop(1));
    store.dispatch(registerWorkshop(2));
    store.dispatch(registerWorkshop(3));
    const before = store.getState().workshops;

    store.dispatch(registerWorkshop(4));
    const after = store.getState().workshops;

    expect(after.registeredIds).toEqual([1, 2, 3]);
    expect(after.items).toEqual(before.items); // số chỗ của workshop 4 vẫn là 10
    expect(after.items[3].remainingSeats).toBe(10);
    expect(after.notice).toEqual({ type: 'error', message: REJECT_MESSAGES.limit });
  });

  it('cho đăng ký lại sau khi huỷ bớt một workshop', () => {
    const store = createLoadedStore();
    [1, 2, 3].forEach((id) => store.dispatch(registerWorkshop(id)));
    store.dispatch(registerWorkshop(4)); // bị chặn
    store.dispatch(cancelRegistration(2));
    store.dispatch(registerWorkshop(4)); // giờ được phép

    expect(store.getState().workshops.registeredIds).toEqual([1, 3, 4]);
  });

  it('đăng ký và huỷ liên tục vẫn giữ dữ liệu nhất quán', () => {
    const store = createLoadedStore();
    for (let i = 0; i < 5; i += 1) {
      store.dispatch(registerWorkshop(1));
      store.dispatch(cancelRegistration(1));
    }

    const { items, registeredIds } = store.getState().workshops;
    expect(registeredIds).toEqual([]);
    expect(items[0].remainingSeats).toBe(10);
  });

  it('khi đã đủ 3, đăng ký trùng workshop cũ báo "trùng" chứ không báo vượt giới hạn', () => {
    const store = createLoadedStore();
    [1, 2, 3].forEach((id) => store.dispatch(registerWorkshop(id)));
    store.dispatch(registerWorkshop(1));

    expect(store.getState().workshops.notice?.message).toBe(REJECT_MESSAGES.duplicate);
    expect(store.getState().workshops.items[0].remainingSeats).toBe(9);
  });
});
