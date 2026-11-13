import { Link, useParams } from 'react-router';
import styles from '../App.module.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long' });

export default function PersonDetail({ people }) {
  const { id } = useParams();
  const person = people.find((p) => p.id === id);

  // 404 guard: kiểm tra trước khi đọc person.name
  if (!person) {
    return (
      <section role="alert" className={`${styles.card} ${styles.detailBox}`}>
        <title>Không tìm thấy · S3T Directory</title>
        <h2 className={styles.cardTitle}>404 — Không tìm thấy hồ sơ</h2>
        <p className={styles.muted}>
          Không có ai với mã <code>{id}</code>.
        </p>
        <Link to="/people" className={styles.button}>
          Quay lại danh bạ
        </Link>
      </section>
    );
  }

  return (
    <article aria-labelledby="person-name" className={`${styles.card} ${styles.detailBox}`}>
      <title>{`${person.name} · S3T Directory`}</title>
      <h2 id="person-name" className={styles.cardTitle}>
        {person.name}
      </h2>
      <dl className={styles.details}>
        <dt>Mã hồ sơ</dt>
        <dd>{person.id}</dd>
        <dt>Vai trò</dt>
        <dd>{person.role}</dd>
        <dt>Nhóm</dt>
        <dd>{person.team}</dd>
        <dt>Nơi làm việc</dt>
        <dd>{person.location}</dd>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </dd>
        <dt>Ngày tham gia</dt>
        <dd>
          <time dateTime={person.joined}>{dateFormat.format(new Date(person.joined))}</time>
        </dd>
      </dl>
    </article>
  );
}