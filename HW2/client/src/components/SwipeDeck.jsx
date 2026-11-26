import { useRef, useState } from 'react';
import ProfileCard from './ProfileCard.jsx';

const THRESHOLD_X = 100; // kéo ngang ≥ 100px mới tính
const THRESHOLD_UP = 100; // kéo lên ≥ 100px mới tính SUPER

export default function SwipeDeck({ currentProfile, nextProfile, onSwipe, onUndo, canUndo }) {
  const [startPos, setStartPos] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const deckRef = useRef(null);

  // ===== 1. BÀN PHÍM =====
  const handleKeyDown = (e) => {
    if (e.repeat) return; // giữ phím không quẹt liên tục
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' };

    if (map[e.key]) {
      e.preventDefault(); // không cuộn trang
      onSwipe(map[e.key]);
    } else if (e.key === 'Backspace') {
      e.preventDefault(); // không quay lại trang trước
      onUndo();
    }
  };

  // ===== 2. POINTER (chuột + cảm ứng + bút) =====
  const handlePointerDown = (e) => {
    if (!currentProfile || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId); // kéo ra ngoài thẻ vẫn nhận sự kiện
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!startPos) return;
    setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const finishDrag = () => {
    if (!startPos) return; // guard: thiếu trong code mẫu slide 31
    const { x: dx, y: dy } = offset;

    if (dy < -THRESHOLD_UP && Math.abs(dx) < THRESHOLD_X) onSwipe('up');
    else if (dx > THRESHOLD_X) onSwipe('right');
    else if (dx < -THRESHOLD_X) onSwipe('left');

    setStartPos(null);
    setOffset({ x: 0, y: 0 }); // không đủ ngưỡng → thẻ trượt về chỗ cũ
  };

  return (
    <section className="deck-section" aria-label="Bộ thẻ hồ sơ">
      <div
        ref={deckRef}
        className="deck"
        tabIndex={0}
        role="group"
        aria-roledescription="bộ thẻ quẹt"
        aria-describedby="deck-help"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {nextProfile && <ProfileCard key={nextProfile._id} profile={nextProfile} />}
        {currentProfile && (
          <ProfileCard
            key={currentProfile._id}
            profile={currentProfile}
            offset={offset}
            isTop
            isDragging={startPos !== null}
          />
        )}
      </div>

      <p id="deck-help" className="deck-help">
        Phím ← bỏ qua · → thích · ↑ siêu thích · Backspace hoàn tác — hoặc kéo thẻ.
      </p>

      {/* Nút bấm: thay thế cho thao tác kéo (WCAG 2.5.7 Dragging Movements) */}
      <div className="deck-actions">
        <button type="button" className="action-btn btn-nope" onClick={() => onSwipe('left')} disabled={!currentProfile}>
          <span aria-hidden="true">✕</span> Bỏ qua
        </button>
        <button type="button" className="action-btn btn-super" onClick={() => onSwipe('up')} disabled={!currentProfile}>
          <span aria-hidden="true">★</span> Siêu thích
        </button>
        <button type="button" className="action-btn btn-like" onClick={() => onSwipe('right')} disabled={!currentProfile}>
          <span aria-hidden="true">♥</span> Thích
        </button>
        <button type="button" className="action-btn btn-undo" onClick={onUndo} disabled={!canUndo}>
          <span aria-hidden="true">↶</span> Hoàn tác
        </button>
      </div>
    </section>
  );
}