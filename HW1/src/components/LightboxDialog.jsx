import { useEffect, useRef } from 'react';

export default function LightboxDialog({ photo, position, total, onClose, onPrev, onNext }) {
  const dialogRef = useRef(null);
  const lastPhotoIdRef = useRef(null); // ảnh cuối cùng đã mở → để trả focus
  const isOpen = photo !== null;

  // ===== 1. Đồng bộ URL → trạng thái <dialog> =====
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal(); // modal thật: focus trap + Esc + inert nền
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Ghi nhớ ảnh đang xem (kể cả khi bấm Prev/Next)
  useEffect(() => {
    if (photo) lastPhotoIdRef.current = photo.id;
  }, [photo]);

  // ===== 2. <dialog> đóng (Esc / nút X / backdrop / Back) → đồng bộ ngược lên URL =====
  const handleClose = () => {
    if (isOpen) onClose(); // tránh gọi lặp khi chính effect ở trên vừa close()

    // Trả focus về thumbnail tương ứng (WCAG 2.4.3 Focus Order)
    const id = lastPhotoIdRef.current;
    if (id) {
      requestAnimationFrame(() => {
        document.querySelector(`[data-photo-id="${id}"]`)?.focus();
      });
    }
  };

  // ===== 3. Bàn phím trong lightbox =====
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
  };

  // Click ra vùng backdrop (chính phần tử <dialog>, không phải nội dung) → đóng
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) dialogRef.current.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-counter"
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      {photo && (
        <div className="lightbox-inner">
          <header className="lightbox-header">
            <h2 id="lightbox-title">{photo.title}</h2>
            <button
              type="button"
              className="icon-btn"
              onClick={() => dialogRef.current.close()}
              aria-label="Đóng"
              autoFocus
            >
              ✕
            </button>
          </header>

          <figure className="lightbox-figure">
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
            />
            <figcaption id="lightbox-counter" aria-live="polite">
              Ảnh {position} / {total}
            </figcaption>
          </figure>

          <div className="lightbox-nav">
            <button type="button" className="nav-btn" onClick={onPrev} aria-label="Ảnh trước">
              ← Trước
            </button>
            <button type="button" className="nav-btn" onClick={onNext} aria-label="Ảnh sau">
              Sau →
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}