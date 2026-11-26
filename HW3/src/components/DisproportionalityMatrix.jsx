import { SEVERITY_LABELS } from '../data/dossiers.js';

const VERDICT = {
  excessive: { label: 'Nặng hơn tiền lệ', icon: '▲' },
  proportional: { label: 'Tương xứng', icon: '=' },
  lenient: { label: 'Nhẹ hơn tiền lệ', icon: '▼' },
};

const formatRatio = (ratio) => (ratio === null ? '∞' : `${ratio.toFixed(2)}×`);
const formatDelta = (d) => (d > 0 ? `+${d}` : String(d));

export default function DisproportionalityMatrix({ matrix }) {
  const { rows, totals } = matrix;

  return (
    <section className="matrix" aria-labelledby="matrix-title">
      <h3 id="matrix-title">Ma trận tương xứng án phạt</h3>
      <p className="matrix-intro">
        So sánh số trận bị cấm thực tế với mức án thường áp dụng (tiền lệ) cho cùng mức độ vi phạm.
      </p>

      <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="matrix-title">
        <table className="matrix-table">
          <caption className="visually-hidden">
            Bảng so sánh án phạt thực tế và tiền lệ, đơn vị: số trận cấm thi đấu
          </caption>
          <thead>
            <tr>
              <th scope="col">Mã</th>
              <th scope="col">Vi phạm</th>
              <th scope="col">Mức độ</th>
              <th scope="col" className="num">Thực tế</th>
              <th scope="col" className="num">Tiền lệ</th>
              <th scope="col" className="num">Chênh lệch</th>
              <th scope="col" className="num">Tỉ lệ</th>
              <th scope="col">Đánh giá</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={`row-${r.verdict}`}>
                <th scope="row">{r.id}</th>
                <td>{r.rule}</td>
                <td>{r.severity} – {SEVERITY_LABELS[r.severity]}</td>
                <td className="num">{r.actual}</td>
                <td className="num">{r.expected}</td>
                <td className="num">{formatDelta(r.delta)}</td>
                <td className="num">{formatRatio(r.ratio)}</td>
                <td>
                  <span className={`verdict verdict-${r.verdict}`}>
                    <span aria-hidden="true">{VERDICT[r.verdict].icon} </span>
                    {VERDICT[r.verdict].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>Tổng cộng</th>
              <td className="num">{totals.actual}</td>
              <td className="num">{totals.expected}</td>
              <td className="num">{formatDelta(totals.delta)}</td>
              <td className="num">{totals.index === null ? '—' : `${totals.index.toFixed(2)}×`}</td>
              <td>{totals.excessiveCount}/{rows.length} vượt tiền lệ</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className={totals.hasGrounds ? 'matrix-summary has-grounds' : 'matrix-summary'}>
        {totals.hasGrounds
          ? `Có ${totals.excessiveCount} vi phạm bị xử nặng hơn tiền lệ — có cơ sở kháng cáo theo căn cứ "không tương xứng".`
          : 'Các án phạt đều tương xứng với tiền lệ.'}
      </p>
    </section>
  );
}