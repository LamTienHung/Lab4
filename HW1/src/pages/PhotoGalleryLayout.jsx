import { useSearchParams } from 'react-router';
import { CATEGORIES, PHOTOS } from '../data/photos.js';
import CategoryFilter from '../components/CategoryFilter.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';
import LightboxDialog from '../components/LightboxDialog.jsx';

const VALID_CATEGORIES = new Set(CATEGORIES.map((c) => c.id));

export default function PhotoGalleryLayout() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===== 1. State DERIVED từ URL (không có useState nào) =====
  const rawCategory = searchParams.get('category');
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : 'all';

  const visiblePhotos =
    category === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === category);

  const photoId = searchParams.get('photoId');
  const selectedIndex = visiblePhotos.findIndex((p) => p.id === photoId);
  const selectedPhoto = selectedIndex >= 0 ? visiblePhotos[selectedIndex] : null;

  // ===== 2. Các hàm ghi lên URL (giữ nguyên param còn lại) =====
  const changeCategory = (nextCategory) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextCategory === 'all') next.delete('category');
      else next.set('category', nextCategory);
      next.delete('photoId'); // đổi danh mục thì đóng lightbox
      return next;
    });
  };

  const openPhoto = (id) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('photoId', id);
      return next;
    });
  };

  const closePhoto = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('photoId'); // CHỈ xoá photoId, giữ category
        return next;
      },
      { replace: true }
    );
  };

  const stepPhoto = (delta) => {
    if (selectedIndex < 0) return;
    const len = visiblePhotos.length;
    const target = visiblePhotos[(selectedIndex + delta + len) % len];
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('photoId', target.id);
        return next;
      },
      { replace: true } // chuyển ảnh không làm đầy history
    );
  };

  // ===== 3. Render =====
  return (
    <>
      <a href="#gallery" className="skip-link">Bỏ qua đến thư viện ảnh</a>

      <header className="gallery-header">
        <h1>Thư viện ảnh Việt Nam</h1>
        <CategoryFilter
          categories={CATEGORIES}
          active={category}
          onChange={changeCategory}
        />
      </header>

      <main id="gallery" tabIndex={-1}>
        <p className="result-count" aria-live="polite">
          Đang hiển thị {visiblePhotos.length} ảnh
        </p>
        <PhotoGrid photos={visiblePhotos} onOpen={openPhoto} />
      </main>

      <LightboxDialog
        photo={selectedPhoto}
        position={selectedIndex + 1}
        total={visiblePhotos.length}
        onClose={closePhoto}
        onPrev={() => stepPhoto(-1)}
        onNext={() => stepPhoto(1)}
      />
    </>
  );
}