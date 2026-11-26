const pad = (n) => String(n).padStart(2, '0');

export default function SlaCountdown({ timer, deadline, issuedAt }) {
  const { remainingMs, hours, minutes, seconds, isExpired, isUrgent } = timer;

  // Phần trăm thời gian SLA đã trôi qua
  const total = deadline - issuedAt;
  const elapsedPct = total > 0 ? Math.min(100, Math.round(((total - remainingMs) / total) * 100)) : 100;

  const state = isExpired ? 'expired' : isUrgent ? 'urgent' : 'normal';
  const stateLabel = {
    normal: 'Còn trong hạn',
    urgent: 'Sắp hết hạn',
    expired: 'Đã hết hạn',
  }[state];

  const deadlineText = new Date(deadline).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <section className={`sla sla-${state}`} aria-labelledby="sla-title">
      <h3 id="sla-title" className="sla-title">Hạn kháng cáo (SLA 72 giờ)</h3>

      {/* role="timer": screen reader KHÔNG đọc mỗi giây (tránh làm phiền) */}
      <p className="sla-clock" role="timer" aria-label={`Còn ${hours} giờ ${minutes} phút`}>
        <span aria-hidden="true">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </p>

      {/* Chỉ thông báo khi TRẠNG THÁI đổi (bình thường → khẩn → hết hạn) */}
      <p className="sla-status" aria-live="polite">
        <span className="sla-dot" aria-hidden="true" /> {stateLabel}
      </p>

      <label className="sla-progress-label" htmlFor="sla-progress">
        Đã dùng {elapsedPct}% thời gian
      </label>
      <progress id="sla-progress" className="sla-progress" max={100} value={elapsedPct}>
        {elapsedPct}%
      </progress>

      <p className="sla-deadline">
        Hạn chót: <time dateTime={new Date(deadline).toISOString()}>{deadlineText}</time>
      </p>
    </section>
  );
}