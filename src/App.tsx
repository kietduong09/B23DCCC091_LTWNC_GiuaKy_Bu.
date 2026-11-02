import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { loadWorkshops } from './features/workshops/workshopsSlice';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // Mở /?simulateError=true để xem trạng thái API lỗi.
  const simulateError = searchParams.get('simulateError') === 'true';

  // Tải danh sách workshop một lần khi ứng dụng khởi động
  // (dùng chung cho cả trang chủ và trang thống kê). Chủ ý chỉ chạy một lần nên simulateError không nằm trong mảng phụ thuộc.
  useEffect(() => {
    void dispatch(loadWorkshops({ simulateError }));
  }, [dispatch]);

  return <AppRoutes />;
}
