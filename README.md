**Xem trạng thái lỗi API:** mở `http://localhost:5173/?simulateError=true`. Lần tải đầu tiên sẽ thất bại, bấm "Thử tải lại" để tải bình thường.

1. Công nghệ sử dụng

- React 18, TypeScript, Vite
- React Router DOM 6
- Redux Toolkit 2 + React Redux 9 (danh sách workshop, danh sách đã đăng ký)
- Zustand 5 (từ khóa tìm kiếm, chủ đề đang chọn)
- React Context (theme sáng/tối)
- Jest 29, ts-jest, React Testing Library, user-event

2. Cài đặt

Yêu cầu: Node.js 18 trở lên (đã thử với Node 22).

```bash
cd mini-workshop
npm install
```

3. Chạy ứng dụng

```bash
npm run dev      
npm run build     
npm run preview   
```

4. Chạy test

```bash
npm test
```

