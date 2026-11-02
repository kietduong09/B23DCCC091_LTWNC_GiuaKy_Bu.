import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('chỉ cập nhật giá trị sau 300ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    expect(result.current).toBe('a');

    rerender({ value: 'ab' });
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a'); // chưa hết 300ms

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab'); // đủ 300ms
  });

  it('gõ liên tục thì chỉ lấy giá trị cuối cùng (timer cũ được xoá)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'r' },
    });

    rerender({ value: 're' });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: 'rea' });
    act(() => {
      jest.advanceTimersByTime(200); // tổng 400ms kể từ lần đổi đầu, nhưng mới 200ms từ lần đổi cuối
    });
    expect(result.current).toBe('r');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('rea');
  });

  it('dọn timer khi component bị huỷ', () => {
    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });
    rerender({ value: 'b' });
    expect(jest.getTimerCount()).toBe(1);

    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
