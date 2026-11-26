import { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { findDossier } from '../data/dossiers.js';
import { computeMatrix } from '../utils/computeMatrix.js';
import useAppealSlaTimer from '../hooks/useAppealSlaTimer.js';
import { AppealFormProvider } from '../context/AppealFormContext.jsx';
import SlaCountdown from '../components/SlaCountdown.jsx';
import DisproportionalityMatrix from '../components/DisproportionalityMatrix.jsx';
import AppealForm from '../components/AppealForm.jsx';
import NotFound from './NotFound.jsx';

export default function DossierView() {
  const { playerID } = useParams();
  const dossier = findDossier(playerID);

  // Hook phải gọi TRƯỚC mọi lệnh return có điều kiện (Rules of Hooks)
  const timer = useAppealSlaTimer(dossier?.appealDeadline);
  const matrix = useMemo(() => computeMatrix(dossier?.incidents ?? []), [dossier]);

  // ===== 404 boundary: ID không tồn tại =====
  if (!dossier) {
    return (
      <NotFound
        title="Không tìm thấy hồ sơ"
        message={`Không có hồ sơ nào với mã "${playerID}".`}
      />
    );
  }

  return (
    <article className="dossier" aria-labelledby="dossier-title">
      <title>{`Hồ sơ ${dossier.displayName} – Fair-Play Tribunal`}</title>

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li><Link to="/">Tổng quan</Link></li>
          <li aria-current="page">{dossier.displayName}</li>
        </ol>
      </nav>

      <header className="dossier-header">
        <h2 id="dossier-title">{dossier.displayName}</h2>
        <dl className="dossier-meta">
          <div><dt>Mã vụ việc</dt><dd>{dossier.caseNumber}</dd></div>
          <div><dt>Đội</dt><dd>{dossier.team}</dd></div>
          <div><dt>Vai trò</dt><dd>{dossier.role}</dd></div>
          <div><dt>Trạng thái</dt><dd>{dossier.status}</dd></div>
        </dl>
        <p className="dossier-summary">{dossier.summary}</p>
      </header>

      <div className="dossier-grid">
        <SlaCountdown
          timer={timer}
          deadline={dossier.appealDeadline}
          issuedAt={dossier.issuedAt}
        />
        <DisproportionalityMatrix matrix={matrix} />
      </div>

      {/* key → đổi hồ sơ thì form được tạo mới, không dính dữ liệu cũ */}
      <AppealFormProvider key={dossier.id} dossier={dossier} isExpired={timer.isExpired}>
        <AppealForm matrixRows={matrix.rows} />
      </AppealFormProvider>
    </article>
  );
}