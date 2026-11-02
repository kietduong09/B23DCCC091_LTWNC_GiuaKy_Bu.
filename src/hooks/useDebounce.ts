import { useEffect, useState } from 'react';

// Trả về `value` sau khi nó không thay đổi trong `delay` ms.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);

    // Mỗi lần value/delay đổi hoặc component bị huỷ, xoá timeout cũ.
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
