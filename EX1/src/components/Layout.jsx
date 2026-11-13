import { NavLink, Outlet } from 'react-router';
import styles from '../App.module.css';

const navClass = ({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink);

export function Layout() {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Bỏ qua điều hướng
      </a>
      <header className={styles.header}>
        <p className={styles.brand}>S3T Directory</p>
        <nav aria-label="Điều hướng chính">
          <ul className={styles.navList}>
            <li>
              {/* end: chỉ active đúng "/" — không active ở mọi trang con */}
              <NavLink to="/" end className={navClass}>
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink to="/people" className={navClass}>
                Danh bạ
              </NavLink>
            </li>
            <li>
              <NavLink to="/form" className={navClass}>
                Biểu mẫu
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navClass}>
                          <li>
              <NavLink to="/forum" className={navClass}>
                Forum
              </NavLink>
            </li>
                Giới thiệu
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}