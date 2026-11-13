import styles from '../App.module.css';

export function PeopleIndex() {
  return (
    <section aria-labelledby="pick-title" className={`${styles.card} ${styles.detailBox}`}>
      <title>Danh bạ · S3T Directory</title>
      <h2 id="pick-title" className={styles.cardTitle}>
        Chọn một hồ sơ
      </h2>
      <p className={styles.muted}>
        Chọn một người ở danh sách để xem chi tiết. Đường dẫn sẽ đổi thành <code>/people/:id</code> — có thể copy
        link hoặc tải lại trang mà vẫn mở đúng hồ sơ.
      </p>
    </section>
  );
}