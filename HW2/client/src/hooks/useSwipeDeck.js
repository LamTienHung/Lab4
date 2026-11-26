import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchProfiles,
  fetchSwipes,
  postSwipe,
  deleteLastSwipe,
  getSessionId,
  resetSessionId,
} from '../api/swipeApi.js';

// Hướng quẹt → loại swipe
export const DIRECTION_TO_TYPE = { left: 'NOPE', right: 'LIKE', up: 'SUPER' };

// Bảng điểm BẤT ĐỐI XỨNG: thích được nhiều, từ chối bị trừ ít
export const SCORE_TABLE = { LIKE: 10, SUPER: 25, NOPE: -5 };

export default function useSwipeDeck() {
  // ===== STATE GỐC (chỉ 4 thứ) =====
  const [profiles, setProfiles] = useState([]);
  const [history, setHistory] = useState([]); // LIFO stack: [{ profileId, type }]
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);

  const sessionIdRef = useRef(getSessionId());
  const busyRef = useRef(false); // khoá: mỗi lúc chỉ 1 request → stack client/server luôn khớp

  // ===== 1. Tải hồ sơ + khôi phục lịch sử từ server =====
  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchProfiles(controller.signal),
      fetchSwipes(sessionIdRef.current, controller.signal),
    ])
      .then(([profileList, swipeList]) => {
        setProfiles(profileList);
        setHistory(
          swipeList.map((s) => ({ profileId: String(s.profileId), type: s.type }))
        );
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  // ===== 2. DERIVED STATE – tính lại mỗi lần render, không lưu riêng =====
  const currentIndex = history.length;
  const currentProfile = profiles[currentIndex] ?? null;
  const nextProfile = profiles[currentIndex + 1] ?? null;
  const isFinished = status === 'ready' && currentIndex >= profiles.length;
  const canUndo = history.length > 0;

  const score = history.reduce((sum, h) => sum + SCORE_TABLE[h.type], 0);
  const stats = history.reduce(
    (acc, h) => ({ ...acc, [h.type]: acc[h.type] + 1 }),
    { LIKE: 0, SUPER: 0, NOPE: 0 }
  );
  const lastAction = history.at(-1) ?? null;

  // ===== 3. SWIPE: push vào stack (optimistic), lỗi thì rollback =====
  const swipe = useCallback(
    async (direction) => {
      const type = DIRECTION_TO_TYPE[direction];
      if (!type || !currentProfile || busyRef.current) return;

      busyRef.current = true;
      const entry = { profileId: currentProfile._id, type };
      setHistory((prev) => [...prev, entry]);
      setError(null);

      try {
        await postSwipe({ ...entry, sessionId: sessionIdRef.current });
      } catch (err) {
        setHistory((prev) => prev.slice(0, -1)); // rollback
        setError(`Không lưu được lượt quẹt: ${err.message}`);
      } finally {
        busyRef.current = false;
      }
    },
    [currentProfile]
  );

  // ===== 4. UNDO: pop phần tử trên cùng (LIFO), lỗi thì đẩy lại =====
  const undoLastSwipe = useCallback(async () => {
    if (!canUndo || busyRef.current) return;

    busyRef.current = true;
    const removed = history.at(-1);
    setHistory((prev) => prev.slice(0, -1));
    setError(null);

    try {
      await deleteLastSwipe(sessionIdRef.current);
    } catch (err) {
      setHistory((prev) => [...prev, removed]); // khôi phục
      setError(`Không hoàn tác được: ${err.message}`);
    } finally {
      busyRef.current = false;
    }
  }, [canUndo, history]);

  // ===== 5. Chơi lại: phiên mới, lịch sử cũ vẫn nằm trong DB =====
  const restart = useCallback(() => {
    if (busyRef.current) return;
    resetSessionId();
    sessionIdRef.current = getSessionId();
    setHistory([]);
    setError(null);
  }, []);

  return {
    status,
    error,
    profiles,
    currentProfile,
    nextProfile,
    currentIndex,
    isFinished,
    canUndo,
    score,
    stats,
    lastAction,
    swipe,
    undoLastSwipe,
    restart,
  };
}