import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingMessage from '../components/common/LoadingMessage';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

// Trang thống kê chỉ được tải khi người dùng truy cập /stats.
const StatsPage = lazy(() => import('../pages/StatsPage'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="stats"
          element={
            <Suspense fallback={<LoadingMessage message="Đang tải trang thống kê..." />}>
              <StatsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
