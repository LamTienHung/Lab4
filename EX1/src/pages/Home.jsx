import { Link } from 'react-router';
import styles from '../App.module.css';

export function Home() {
  return (
    <section aria-labelledby="home-title" className={`${styles.card} ${styles.pageBox}`}>
      <title>Trang chủ · S3T Directory</title>
      <h1 id="home-title" className={styles.pageTitle}>
        S3T Directory
      </h1>
      <p className={styles.muted}>
        Danh bạ nhiều route xây bằng React Router v7: layout lồng nhau với <code>&lt;Outlet /&gt;</code>, trang chi
        tiết đọc <code>useParams()</code>, và mỗi trang được tách chunk bằng <code>React.lazy</code>.
      </p>
      <Link to="/people" className={styles.button}>
        Mở danh bạ
      </Link>
    </section>
  );
}