
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink
          to="/"
          className="header__brand"
          aria-label="Workshop Hub"
        >
          <img
            src="/favicon.svg"
            alt="Mini Workshop"
            className="header__logo"
          />
        </NavLink>

        <nav className="header__nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>
            Workshop
          </NavLink>

          <NavLink to="/stats">
            Thống kê
          </NavLink>
        </nav>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'light'
              ? 'Chuyển sang chế độ tối'
              : 'Chuyển sang chế độ sáng'
          }
          title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        >
          {theme === 'light' ? (
            // Đang ở chế độ sáng: hiển thị mặt trăng
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
            </svg>
          ) : (
            // Đang ở chế độ tối: hiển thị mặt trời
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.42 1.42" />
              <path d="m17.65 17.65 1.42 1.42" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.35 17.65-1.42 1.42" />
              <path d="m19.07 4.93-1.42 1.42" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
