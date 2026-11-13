import { Link, useLocation } from 'react-router';
import styles from '../App.module.css';

export function NotFound() {
  const { pathname } = useLocation();
  return (
    <section aria-labelledby="nf-title" className={`${styles.card} ${styles.pageBox}`}>
      <title>404 · S3T Directory</title>
      <h1 id="nf-title" className={styles.pageTitle}>
        404 — Không tìm thấy trang
      </h1>
      <p className={styles.muted}>
        Đường dẫn <code>{pathname}</code> không tồn tại.
      </p>
      <Link to="/" className={styles.button}>
        Về trang chủ
      </Link>
    </section>
  );
}