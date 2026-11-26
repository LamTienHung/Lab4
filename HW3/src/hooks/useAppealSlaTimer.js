import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const URGENT_THRESHOLD = 6 * HOUR; // còn < 6 giờ → khẩn cấp

/**
 * Đếm ngược hạn kháng cáo KHÔNG BỊ TRÔI (zero-drift).
 *
 * Nguyên tắc: KHÔNG đếm lùi kiểu "remaining - 1" mỗi giây.
 * Luôn tính lại: remaining = deadline - Date.now()
 *   → timer chạy trễ, tab bị ngủ, máy bị treo… vẫn hiển thị đúng.
 */
export default function useAppealSlaTimer(deadline) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    let timeoutId;

    // Lên lịch tick đúng vào đầu giây tiếp theo (căn theo đồng hồ hệ thống)
    const schedule = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) return; // hết hạn → dừng hẳn

      const msToNextSecond = SECOND - (current % SECOND);
      timeoutId = setTimeout(schedule, msToNextSecond);
    };

    // Tab ẩn → trình duyệt làm chậm timer; khi hiện lại thì đồng bộ ngay
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timeoutId);
        schedule();
      }
    };

    schedule();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [deadline]);

  // ===== Derived values =====
  const remainingMs = deadline ? Math.max(0, deadline - now) : 0;
  const isExpired = remainingMs === 0;
  const isUrgent = !isExpired && remainingMs < URGENT_THRESHOLD;

  const hours = Math.floor(remainingMs / HOUR);
  const minutes = Math.floor((remainingMs % HOUR) / MINUTE);
  const seconds = Math.floor((remainingMs % MINUTE) / SECOND);

  return { remainingMs, hours, minutes, seconds, isExpired, isUrgent };
}