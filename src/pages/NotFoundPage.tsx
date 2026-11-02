import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <h1>Không tìm thấy trang</h1>
      <p>
        Đường dẫn này không tồn tại. <Link to="/">Quay về danh sách workshop</Link>
      </p>
    </>
  );
}
