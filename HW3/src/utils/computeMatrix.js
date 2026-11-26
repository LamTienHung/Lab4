import { PRECEDENT_BANS } from '../data/dossiers.js';

/**
 * Tính Disproportionality Matrix cho một hồ sơ.
 * Hàm THUẦN (pure): cùng đầu vào → cùng kết quả, không đổi dữ liệu gốc.
 *
 * Mỗi dòng: so sánh án phạt thực tế với mức án chuẩn theo tiền lệ.
 *   delta > 0  → nặng hơn tiền lệ (excessive)
 *   delta = 0  → tương xứng (proportional)
 *   delta < 0  → nhẹ hơn tiền lệ (lenient)
 */
export function computeMatrix(incidents = []) {
  const rows = incidents.map((inc) => {
    const expected = PRECEDENT_BANS[inc.severity] ?? 0;
    const actual = inc.banMatches;
    const delta = actual - expected;

    // Tỉ lệ actual/expected; expected = 0 thì không chia được
    const ratio = expected === 0 ? (actual === 0 ? 1 : null) : actual / expected;

    let verdict = 'proportional';
    if (delta > 0) verdict = 'excessive';
    else if (delta < 0) verdict = 'lenient';

    return { ...inc, expected, actual, delta, ratio, verdict };
  });

  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const totalExpected = rows.reduce((s, r) => s + r.expected, 0);
  const excessiveCount = rows.filter((r) => r.verdict === 'excessive').length;

  // Chỉ số tổng: >1 nghĩa là tổng án nặng hơn tiền lệ
  const index = totalExpected === 0 ? null : totalActual / totalExpected;

  return {
    rows,
    totals: {
      actual: totalActual,
      expected: totalExpected,
      delta: totalActual - totalExpected,
      index,
      excessiveCount,
      hasGrounds: excessiveCount > 0, // có cơ sở kháng cáo hay không
    },
  };
}