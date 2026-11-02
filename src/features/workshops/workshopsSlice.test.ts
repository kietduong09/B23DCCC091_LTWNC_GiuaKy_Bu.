import workshopsReducer, {
  cancelRegistration,
  clearNotice,
  initialState,
  loadWorkshops,
  registerWorkshop,
  registrationRejected,
} from './workshopsSlice';
import { REJECT_MESSAGES } from './types';
import type { Workshop, WorkshopsState } from './types';

const sampleWorkshops: Workshop[] = [
  { id: 1, name: 'React cơ bản', speaker: 'An', topic: 'Lập trình', date: '2026-11-10', totalSeats: 20, remainingSeats: 20 },
  { id: 2, name: 'Machine Learning', speaker: 'Bình', topic: 'AI', date: '2026-11-15', totalSeats: 10, remainingSeats: 0 },
];

// State đã tải xong dữ liệu mẫu, dùng làm điểm bắt đầu cho các test đăng ký.
const loadedState: WorkshopsState = { ...initialState, status: 'succeeded', items: sampleWorkshops };

describe('workshopsSlice', () => {
  it('trả về state ban đầu', () => {
    expect(workshopsReducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      registeredIds: [],
      status: 'idle',
      error: null,
      notice: null,
    });
  });

  it('chuyển sang loading khi loadWorkshops.pending', () => {
    const state = workshopsReducer(initialState, loadWorkshops.pending('req-1', undefined));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('lưu danh sách workshop khi loadWorkshops.fulfilled', () => {
    const state = workshopsReducer(initialState, loadWorkshops.fulfilled(sampleWorkshops, 'req-1', undefined));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(sampleWorkshops);
  });

  it('lưu thông báo lỗi khi loadWorkshops.rejected', () => {
    const state = workshopsReducer(
      initialState,
      loadWorkshops.rejected(null, 'req-1', undefined, 'API lỗi'),
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('API lỗi');
    expect(state.items).toEqual([]);
  });

  it('đăng ký workshop: thêm vào danh sách và giảm 1 chỗ', () => {
    const state = workshopsReducer(loadedState, registerWorkshop(1));
    expect(state.registeredIds).toEqual([1]);
    expect(state.items[0].remainingSeats).toBe(19);
    expect(state.notice?.type).toBe('success');
  });

  it('huỷ đăng ký: xoá khỏi danh sách và trả lại 1 chỗ', () => {
    const registered = workshopsReducer(loadedState, registerWorkshop(1));
    const state = workshopsReducer(registered, cancelRegistration(1));
    expect(state.registeredIds).toEqual([]);
    expect(state.items[0].remainingSeats).toBe(20);
  });

  it('có thể đăng ký lại sau khi huỷ', () => {
    let state = workshopsReducer(loadedState, registerWorkshop(1));
    state = workshopsReducer(state, cancelRegistration(1));
    state = workshopsReducer(state, registerWorkshop(1));
    expect(state.registeredIds).toEqual([1]);
    expect(state.items[0].remainingSeats).toBe(19);
  });

  it('không đăng ký trùng một workshop', () => {
    const registered = workshopsReducer(loadedState, registerWorkshop(1));
    const state = workshopsReducer(registered, registerWorkshop(1));
    expect(state.registeredIds).toEqual([1]);
    expect(state.items[0].remainingSeats).toBe(19); // không bị trừ lần 2
    expect(state.notice).toEqual({ type: 'error', message: REJECT_MESSAGES.duplicate });
  });

  it('không đăng ký workshop đã hết chỗ và số chỗ không âm', () => {
    const state = workshopsReducer(loadedState, registerWorkshop(2));
    expect(state.registeredIds).toEqual([]);
    expect(state.items[1].remainingSeats).toBe(0);
    expect(state.notice).toEqual({ type: 'error', message: REJECT_MESSAGES.full });
  });

  it('huỷ workshop chưa đăng ký thì không làm tăng số chỗ', () => {
    const state = workshopsReducer(loadedState, cancelRegistration(1));
    expect(state.items[0].remainingSeats).toBe(20); // không vượt quá tổng số chỗ
    expect(state.registeredIds).toEqual([]);
  });

  it('registrationRejected chỉ đổi thông báo, không đổi dữ liệu', () => {
    const registered = workshopsReducer(loadedState, registerWorkshop(1));
    const state = workshopsReducer(registered, registrationRejected({ workshopId: 2, reason: 'limit' }));
    expect(state.items).toEqual(registered.items);
    expect(state.registeredIds).toEqual(registered.registeredIds);
    expect(state.notice).toEqual({ type: 'error', message: REJECT_MESSAGES.limit });
  });

  it('clearNotice xoá thông báo', () => {
    const registered = workshopsReducer(loadedState, registerWorkshop(1));
    expect(workshopsReducer(registered, clearNotice()).notice).toBeNull();
  });
});
