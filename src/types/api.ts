// Kiểu kết quả chung cho mọi API giả lập.
// Dùng generic T để mỗi API có thể trả về kiểu dữ liệu riêng.

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// Type guard: sau khi gọi hàm này, TypeScript biết chắc response có `data`.
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.ok === true;
}

// Type guard: sau khi gọi hàm này, TypeScript biết chắc response có `error`.
export function isApiFailure<T>(response: ApiResponse<T>): response is ApiFailure {
  return response.ok === false;
}
