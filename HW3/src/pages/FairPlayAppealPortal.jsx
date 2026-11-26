import { NavLink, Outlet, Link } from 'react-router';
import { DOSSIERS } from '../data/dossiers.js';
import { computeMatrix } from '../utils/computeMatrix.js';

// ===== Layout chính: header + điều hướng + <Outlet /> =====
export default function FairPlayAppealPortal() {
  return (
    <div className="portal">
      <a href="#main" className="skip-link">Bỏ qua đến nội dung chính</a>

      <header className="portal-header">
        <p className="portal-kicker">Esports Integrity Office · Mô phỏng</p>
        <h1>
          <Link to="/" className="portal-home">Fair-Play Appeal Tribunal</Link>
        </h1>
      </header>

      <div className="portal-body">
        <nav className="portal-nav" aria-label="Danh sách hồ sơ">
          <h2 className="nav-title">Hồ sơ</h2>
          <ul>
            {DOSSIERS.map((d) => (
              <li key={d.id}>
                {/* NavLink tự gắn aria-current="page" khi đang active */}
                <NavLink
                  to={`/dossier/${d.id}`}
                  className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                >
                  <span className="nav-name">{d.displayName}</span>
                  <span className="nav-case">{d.caseNumber}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main" className="portal-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <footer className="portal-footer">
        <p>Dữ liệu hư cấu phục vụ bài tập Lab 4 – UIT S3T.</p>
      </footer>
    </div>
  );
}

// ===== Trang tổng quan (route index "/") =====
export function PortalOverview() {
  return (
    <section aria-labelledby="overview-title">
      <title>Tổng quan – Fair-Play Tribunal</title>
      <h2 id="overview-title">Tổng quan hồ sơ kháng cáo</h2>
      <p>Chọn một hồ sơ để xem ma trận tương xứng án phạt, thời hạn SLA và nộp đơn kháng cáo.</p>

      <ul className="overview-cards">
        {DOSSIERS.map((d) => {
          const { totals } = computeMatrix(d.incidents);
          return (
            <li key={d.id} className="overview-card">
              <h3>
                <Link to={`/dossier/${d.id}`}>{d.displayName}</Link>
              </h3>
              <dl>
                <div><dt>Mã vụ việc</dt><dd>{d.caseNumber}</dd></div>
                <div><dt>Tổng án / tiền lệ</dt><dd>{totals.actual} / {totals.expected} trận</dd></div>
                <div><dt>Chỉ số tương xứng</dt><dd>{totals.index === null ? '—' : `${totals.index.toFixed(2)}×`}</dd></div>
                <div>
                  <dt>Hạn kháng cáo</dt>
                  <dd>
                    <time dateTime={new Date(d.appealDeadline).toISOString()}>
                      {new Date(d.appealDeadline).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </time>
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}