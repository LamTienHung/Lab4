import { NavLink, Outlet } from 'react-router';
import styles from '../App.module.css';

const linkClass = ({ isActive }) => (isActive ? `${styles.personLink} ${styles.active}` : styles.personLink);

export default function PeopleLayout({ people }) {
  return (
    <section aria-labelledby="people-title" className={styles.directory}>
      <nav aria-labelledby="people-title" className={`${styles.card} ${styles.sidebarBox}`}>
        <h1 id="people-title" className={styles.cardTitle}>
          Danh bạ ({people.length})
        </h1>
        <ul className={styles.personList}>
          {people.map((p) => (
            <li key={p.id}>
              <NavLink to={`/people/${p.id}`} className={linkClass}>
                <strong>{p.name}</strong>
                <span className={styles.muted}>{p.role}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </section>
  );
}