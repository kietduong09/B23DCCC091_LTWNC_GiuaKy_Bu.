import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__brand">Mini Workshop</span>
        <nav className="header__nav" aria-label="Điều hướng chính">
          <NavLink to="/" end>
            Workshop
          </NavLink>
          <NavLink to="/stats">Thống kê</NavLink>
        </nav>
        <button type="button" className="button button--outline" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </div>
    </header>
  );
}