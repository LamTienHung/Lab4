import { Navigate, Link } from 'react-router';
import PhotoGalleryLayout from './pages/PhotoGalleryLayout.jsx';

function NotFound() {
  return (
    <main className="not-found">
      <h1>404 – Không tìm thấy trang</h1>
      <p>
        <Link to="/gallery">Quay về thư viện ảnh</Link>
      </p>
    </main>
  );
}

export const routes = [
  { path: '/', element: <Navigate to="/gallery" replace /> },
  { path: '/gallery', element: <PhotoGalleryLayout /> },
  { path: '*', element: <NotFound /> },
];