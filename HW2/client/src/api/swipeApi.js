// ===== Session ID: mỗi trình duyệt một phiên chơi riêng =====
const SESSION_KEY = 'swipe-session-id';

export function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // localStorage bị chặn (chế độ riêng tư) → phiên tạm, mất khi F5
    return crypto.randomUUID();
  }
}

export function resetSessionId() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* bỏ qua */
  }
}

// ===== Hàm gọi API chung: ném lỗi kèm message từ server =====
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? `Lỗi ${res.status}`);
  }
  return data;
}

// ===== Các endpoint =====
export const fetchProfiles = (signal) =>
  request('/api/profiles', { signal });

export const fetchSwipes = (sessionId, signal) =>
  request(`/api/swipes?sessionId=${encodeURIComponent(sessionId)}`, { signal });

export const postSwipe = ({ profileId, type, sessionId }) =>
  request('/api/swipe', {
    method: 'POST',
    body: JSON.stringify({ profileId, type, sessionId }),
  });

export const deleteLastSwipe = (sessionId) =>
  request(`/api/swipe/last?sessionId=${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  });