import styles from '../App.module.css';

function Block({ className }) {
  return <span aria-hidden="true" className={`${styles.shimmer} ${className}`} />;
}

// Kích thước khớp đúng nội dung thật → CLS = 0 khi chunk tải xong
export function Skeleton({ variant = 'page' }) {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className={variant === 'directory' ? styles.directory : undefined}
    >
      <span className={styles.srOnly}>Đang tải nội dung…</span>
      {variant === 'directory' && <Block className={styles.sidebarBox} />}
      <Block className={variant === 'page' ? styles.pageBox : styles.detailBox} />
    </section>
  );
}