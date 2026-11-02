# Mini Workshop

Ứng dụng quản lý đăng ký workshop dành cho sinh viên. Đây là bài tập giữa kỳ môn **Lập trình Web nâng cao**, xây dựng bằng React + TypeScript.

## 1. Giới thiệu

Sinh viên xem danh sách workshop, tìm kiếm, lọc theo chủ đề, đăng ký hoặc huỷ đăng ký. Mỗi sinh viên chỉ được đăng ký **tối đa 3 workshop** cùng lúc. Dữ liệu lấy từ một API giả lập (không cần backend).

## 2. Chức năng

| Chức năng | Mô tả |
| --- | --- |
| Tải danh sách | API giả lập trễ 500ms, hiện "Đang tải...", báo lỗi và có nút "Thử tải lại" |
| Tìm kiếm | Theo tên workshop hoặc diễn giả, không phân biệt hoa thường, debounce 300ms |
| Lọc chủ đề | Tất cả / Lập trình / AI / Kỹ năng mềm, kết hợp được với tìm kiếm |
| Đăng ký | Thêm vào danh sách đã đăng ký, số chỗ còn lại giảm 1, không đăng ký trùng, không đăng ký khi hết chỗ |
| Huỷ đăng ký | Xoá khỏi danh sách, số chỗ tăng 1, có thể đăng ký lại |
| Giới hạn 3 workshop | Chặn bằng middleware Redux tự viết, hiện thông báo ngay trên giao diện |
| Sáng / tối | Nút chuyển theme, áp dụng cho toàn bộ giao diện, nhớ lựa chọn bằng `localStorage` |
| Thống kê | Trang `/stats` (lazy load): số workshop theo chủ đề và số workshop đang đăng ký |

**Xem trạng thái lỗi API:** mở `http://localhost:5173/?simulateError=true`. Lần tải đầu tiên sẽ thất bại, bấm "Thử tải lại" để tải bình thường.

## 3. Công nghệ sử dụng

- React 18, TypeScript, Vite
- React Router DOM 6
- Redux Toolkit 2 + React Redux 9 (danh sách workshop, danh sách đã đăng ký)
- Zustand 5 (từ khóa tìm kiếm, chủ đề đang chọn)
- React Context (theme sáng/tối)
- Jest 29, ts-jest, React Testing Library, user-event

## 4. Cấu trúc thư mục

```
mini-workshop/
├── index.html
├── package.json
├── tsconfig.json             # cấu hình TypeScript cho ứng dụng
├── tsconfig.jest.json        # cấu hình TypeScript riêng cho Jest (CommonJS)
├── jest.config.cjs
├── vite.config.ts
└── src/
    ├── api/
    │   ├── workshopsApi.ts          # API giả lập (Promise + generic)
    │   └── mockWorkshops.ts         # 11 workshop mẫu
    ├── app/
    │   ├── store.ts                 # configureStore
    │   ├── hooks.ts                 # useAppDispatch, useAppSelector
    │   └── middleware/
    │       └── registrationMiddleware.ts   # giới hạn 3 workshop
    ├── features/
    │   ├── workshops/
    │   │   ├── components/          # WorkshopItem, WorkshopList, WorkshopFilters, NoticeBanner, RegisteredSummary
    │   │   ├── types.ts             # Workshop, WorkshopTopic, WorkshopsState...
    │   │   ├── workshopsSlice.ts    # slice + createAsyncThunk
    │   │   └── workshopUtils.ts     # lọc, đếm theo chủ đề, định dạng ngày
    │   └── filters/
    │       └── filterStore.ts       # Zustand store
    ├── components/
    │   ├── layout/                  # Header, Layout
    │   └── common/                  # LoadingMessage
    ├── context/ThemeContext.tsx     # ThemeProvider + useTheme
    ├── hooks/useDebounce.ts
    ├── pages/                       # HomePage, StatsPage, NotFoundPage
    ├── routes/AppRoutes.tsx
    ├── types/api.ts                 # ApiResponse<T> + type guard
    ├── App.tsx, main.tsx, index.css
    └── *.test.ts(x)                 # test đặt cạnh file được kiểm thử
```

## 5. Cài đặt

Yêu cầu: Node.js 18 trở lên (đã thử với Node 22).

```bash
cd mini-workshop
npm install
```

## 6. Chạy ứng dụng

```bash
npm run dev       # chạy chế độ phát triển, mở http://localhost:5173
npm run build     # kiểm tra TypeScript và build production vào thư mục dist
npm run preview   # chạy thử bản build
```

## 7. Chạy test

```bash
npm test
```

Gồm 40 test ở 6 file:

| File | Nội dung |
| --- | --- |
| `workshopsSlice.test.ts` | State ban đầu, pending / fulfilled / rejected, đăng ký, huỷ, đăng ký trùng, hết chỗ, số chỗ không âm và không vượt tổng |
| `registrationMiddleware.test.ts` | Chặn workshop thứ 4 trên store thật, đăng ký lại sau khi huỷ, đăng ký/huỷ liên tục |
| `WorkshopItem.test.tsx` | Hiển thị thông tin, click "Đăng ký" gọi callback đúng ID, nút bị disabled khi hết chỗ, nút "Huỷ" |
| `useDebounce.test.ts` | Fake timers: chưa đổi ở 299ms, đổi ở 300ms, dọn timer |
| `workshopUtils.test.ts` | Tìm kiếm, lọc, kết hợp, đếm theo chủ đề |
| `App.test.tsx` | Test tích hợp toàn ứng dụng: loading, lỗi + tải lại, đăng ký/huỷ, giới hạn 3, tìm kiếm + lọc, theme, trang thống kê |

## 8. Redux Toolkit hoạt động thế nào

- **Store** (`app/store.ts`): `configureStore` ghép reducer `workshops` và thêm middleware tự viết.
- **Slice** (`workshopsSlice.ts`): `createSlice` chứa state `{ items, registeredIds, status, error, notice }` và các reducer `registerWorkshop`, `cancelRegistration`, `registrationRejected`, `clearNotice`. Immer cho phép viết kiểu "gán trực tiếp" mà state vẫn bất biến.
- **Async thunk**: `loadWorkshops` (`createAsyncThunk`) gọi API giả lập. Ba trạng thái được xử lý trong `extraReducers`:
  - `pending` → `status = 'loading'` (giao diện hiện "Đang tải...")
  - `fulfilled` → lưu `items`, `status = 'succeeded'`
  - `rejected` → lưu thông báo lỗi, `status = 'failed'` (giao diện hiện lỗi và nút "Thử tải lại")
- **Typed hooks** (`app/hooks.ts`): `useAppDispatch`, `useAppSelector` có sẵn kiểu nên component không phải tự khai báo kiểu.
- Khi đăng ký, reducer **cùng lúc** thêm ID vào `registeredIds` và giảm `remainingSeats`; khi huỷ thì làm ngược lại (và không cho vượt `totalSeats`). Nhờ vậy danh sách đăng ký và số chỗ luôn khớp nhau.

## 9. Middleware giới hạn đăng ký 3 workshop

File: `src/app/middleware/registrationMiddleware.ts`

Mọi action đi qua middleware **trước** khi đến reducer. Luồng xử lý:

```
dispatch(registerWorkshop(id))
        │
        ▼
 registrationMiddleware
        │
        ├─ Không phải registerWorkshop ──────────────▶ next(action) → reducer
        │
        ├─ Là registerWorkshop, chưa đủ 3 ───────────▶ next(action) → reducer (đăng ký bình thường)
        │
        └─ Là registerWorkshop, đã đủ 3 workshop
               ├─ KHÔNG gọi next(action)  → reducer không nhận được action, dữ liệu không đổi
               └─ dispatch(registrationRejected({ reason: 'limit' }))
                        → reducer chỉ cập nhật `notice` → giao diện hiện thông báo lỗi
```

Điểm cần lưu ý:

- Giới hạn chỉ được kiểm tra ở middleware, **không** kiểm tra trong component và không kiểm tra trong reducer.
- Middleware đọc số workshop đã đăng ký từ `getState()` tại thời điểm action được dispatch, nên đăng ký/huỷ liên tục vẫn đúng.
- Nếu workshop đã được đăng ký rồi thì middleware cho đi tiếp để reducer báo "đã đăng ký" (không báo nhầm là vượt giới hạn).
- Reducer vẫn tự kiểm tra các điều kiện khác: đăng ký trùng và hết chỗ.

## 10. Vai trò của Zustand và Context

- **Zustand** (`features/filters/filterStore.ts`): chứa state giao diện thuần tuý là `searchTerm` và `selectedTopic`. Đây là state cục bộ của bộ lọc, không cần thunk hay middleware nên không đưa vào Redux. Component đọc từng phần bằng selector (`useFilterStore((s) => s.searchTerm)`).
- **React Context** (`context/ThemeContext.tsx`): `ThemeProvider` giữ theme `light | dark`, gắn `data-theme` lên thẻ `<html>` để CSS đổi biến màu cho toàn trang. Hook `useTheme` lấy theme và `toggleTheme`; `value` của Context được bọc bằng `useMemo`.

## 11. useDebounce và các kỹ thuật tối ưu

- **`useDebounce<T>(value, delay)`** (`hooks/useDebounce.ts`): giữ một bản sao của `value` và chỉ cập nhật sau khi `value` không đổi trong `delay` ms. Mỗi lần `value` đổi, `useEffect` xoá timeout cũ (cleanup) rồi đặt timeout mới. Trang chủ dùng nó với delay 300ms, nên ô tìm kiếm phản hồi ngay khi gõ nhưng danh sách chỉ lọc khi người dùng ngừng gõ.
- **`useMemo`**: tính danh sách sau lọc (`HomePage`), số liệu thống kê (`StatsPage`), danh sách đã đăng ký (`RegisteredSummary`) và `value` của ThemeContext.
- **`React.memo`**: `WorkshopItem` chỉ render lại khi props của chính nó đổi. Khi đăng ký một workshop, Redux (Immer) giữ nguyên tham chiếu của các workshop khác nên chúng không render lại.
- **`useCallback`**: `handleRegister`, `handleCancel`, `handleRetry` giữ tham chiếu ổn định để `React.memo` có tác dụng.
- **key theo ID**: danh sách dùng `key={workshop.id}`, không dùng index.
- **`React.lazy` + `Suspense`**: trang `/stats` được tách thành chunk riêng (thấy rõ trong kết quả `npm run build`) và hiện "Đang tải trang thống kê..." trong lúc tải.

## 12. TypeScript

- `Workshop`, `WorkshopTopic`, `TopicFilter`, `WorkshopsState`, `Notice`... trong `features/workshops/types.ts`.
- `ApiResponse<T> = ApiSuccess<T> | ApiFailure` cùng type guard `isApiSuccess` / `isApiFailure` trong `types/api.ts`; thunk dùng `isApiSuccess` để phân biệt hai trường hợp.
- Utility types thực sự được dùng:
  - `Record<WorkshopTopic, number>` (`TopicCounts`) cho thống kê, `Record<RejectReason, string>` cho thông báo từ chối.
  - `Partial<FetchWorkshopsOptions>` cho tham số tuỳ chọn của API (giả lập lỗi, độ trễ).
  - `Readonly<Workshop>` cho props của `WorkshopItem` và dữ liệu mẫu.
- Không dùng `any`; không dùng ép kiểu `as` ngoài `as const`.
