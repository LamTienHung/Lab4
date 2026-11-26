import { Link } from 'react-router';
import { DOSSIERS } from '../data/dossiers.js';

export default function NotFound({
  title = '404 – Không tìm thấy trang',
  message = 'Đường dẫn bạn truy cập không tồn tại.',
}) {
  return (
    <section className="not-found" aria-labelledby="nf-title">
      <title>{`${title} – Fair-Play Tribunal`}</title>

      <h2 id="nf-title">{title}</h2>
      <p>{message}</p>

      <p>Các hồ sơ hiện có:</p>
      <ul className="nf-links">
        {DOSSIERS.map((d) => (
          <li key={d.id}>
            <Link to={`/dossier/${d.id}`}>{d.displayName} ({d.caseNumber})</Link>
          </li>
        ))}
      </ul>

      <p>
        <Link to="/">← Về trang tổng quan</Link>
      </p>
    </section>
  );
}