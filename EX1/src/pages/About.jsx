import styles from '../App.module.css';

export default function About() {
  return (
    <section aria-labelledby="about-title" className={`${styles.card} ${styles.pageBox}`}>
      <title>Giới thiệu · S3T Directory</title>
      <h1 id="about-title" className={styles.pageTitle}>
        Giới thiệu
      </h1>
      <ul className={styles.featureList}>
        <li>Routes lồng nhau với <code>&lt;Routes&gt;</code>, <code>element</code> và <code>&lt;Outlet /&gt;</code>.</li>
        <li><code>NavLink</code> đánh dấu trang hiện tại bằng callback <code>className</code> và <code>aria-current</code>.</li>
        <li>Master-detail bằng CSS Grid <code>minmax(280px, 1fr) 2fr</code>.</li>
        <li>Mỗi trang là một chunk riêng, fallback là skeleton cùng kích thước (CLS = 0).</li>
      </ul>
    </section>
  );
}