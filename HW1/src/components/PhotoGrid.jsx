export default function PhotoGrid({ photos, onOpen }) {
  if (photos.length === 0) {
    return <p className="empty">Không có ảnh nào trong danh mục này.</p>;
  }

  return (
    <ul className="photo-grid">
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <button
            type="button"
            className="photo-thumb"
            data-photo-id={photo.id}
            onClick={() => onOpen(photo.id)}
            aria-haspopup="dialog"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading={index < 3 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />
            <span className="photo-title">{photo.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}