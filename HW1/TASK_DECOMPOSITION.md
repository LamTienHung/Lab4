# Task Decomposition — HW1 Photo Gallery

**Mục tiêu:** Thư viện ảnh SPA có deep linking bằng `useSearchParams()`, lightbox bằng `<dialog>` gốc, đạt WCAG 2.2 AA và Lighthouse 100/100.

## Sprint 0 — Khởi tạo
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 0.1 | Tạo project Vite + React 19 + Router v7 | `package.json`, `vite.config.js` | `npm run dev` chạy được |
| 0.2 | HTML khung có `lang`, `description`, `viewport` | `index.html` | Không cảnh báo SEO cơ bản |
| 0.3 | Viết quy tắc dự án | `project-rules.md` | Có quy tắc state, a11y, perf |

## Sprint 1 — Dữ liệu & Routing
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 1.1 | Dữ liệu ảnh + danh mục (`id` là string, có `alt`, `width`, `height`) | `src/data/photos.js` | 9 ảnh, 3 danh mục |
| 1.2 | Chuẩn bị ảnh `.webp` 800×600 | `public/photos/` | Mỗi ảnh ≤ ~80KB |
| 1.3 | Khởi tạo `createBrowserRouter` | `src/main.jsx` | App render không lỗi |
| 1.4 | Khai báo routes: `/` → `/gallery`, `*` → 404 | `src/App.jsx` | Vào URL lạ hiện trang 404 |

## Sprint 2 — Deep Linking (`useSearchParams`)
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 2.1 | Đọc `category`, `photoId` từ URL + validate | `pages/PhotoGalleryLayout.jsx` | `?category=abc` → hiển thị tất cả |
| 2.2 | Derived state: `visiblePhotos`, `selectedPhoto`, `selectedIndex` | như trên | Không có `useState` trong file |
| 2.3 | Hàm ghi URL giữ param cũ (`changeCategory`, `openPhoto`, `closePhoto`, `stepPhoto`) | như trên | Đóng ảnh không mất bộ lọc |
| 2.4 | Bộ lọc danh mục bằng `<button aria-pressed>` | `components/CategoryFilter.jsx` | Đổi lọc → URL đổi theo |
| 2.5 | Lưới ảnh, thumbnail là `<button>` | `components/PhotoGrid.jsx` | Tab + Enter mở ảnh được |

## Sprint 3 — Lightbox `<dialog>`
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 3.1 | Đồng bộ URL → `showModal()` / `close()` | `components/LightboxDialog.jsx` | Mở link có `photoId` → dialog mở sẵn |
| 3.2 | Đồng bộ ngược: sự kiện `close` → xoá `photoId` | như trên | Esc / X / backdrop đều cập nhật URL |
| 3.3 | Trả focus về thumbnail khi đóng | như trên | Focus về đúng ảnh kể cả sau khi Prev/Next |
| 3.4 | Điều hướng ←/→ và nút Trước/Sau | như trên | Vòng lặp từ ảnh cuối về ảnh đầu |
| 3.5 | Nút Back trình duyệt đóng dialog | như trên | Không gọi `onClose` 2 lần |

## Sprint 4 — Giao diện & Accessibility
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 4.1 | Design tokens màu, tương phản ≥ 4.5:1 | `styles/gallery.css` | Kiểm tra bằng WebAIM Contrast Checker |
| 4.2 | Focus ring `:focus-visible`, skip link | như trên | Thấy rõ focus khi dùng Tab |
| 4.3 | Vùng bấm ≥ 44px, grid responsive | như trên | Dùng tốt ở màn 360px |
| 4.4 | `prefers-reduced-motion` | như trên | Tắt animation khi bật trong OS |
| 4.5 | `aria-live` cho số lượng ảnh & vị trí ảnh | page + dialog | Screen reader đọc khi thay đổi |

## Sprint 5 — Kiểm thử & Nộp bài
| # | Task | Công cụ | Tiêu chí hoàn thành |
|---|---|---|---|
| 5.1 | Lint | `npm run lint` | 0 lỗi |
| 5.2 | Kiểm tra a11y tự động | axe DevTools | 0 lỗi |
| 5.3 | Kiểm tra chỉ dùng bàn phím | Thủ công | Hoàn thành mọi thao tác không cần chuột |
| 5.4 | Kiểm tra screen reader | NVDA / VoiceOver | Đọc đúng tên nút, tiêu đề dialog |
| 5.5 | Lighthouse trên bản build | `npm run build && npm run preview` | 4 hạng mục = 100 |
| 5.6 | Ghi lỗi AI & cách sửa | `AI_FAILURE_AUDIT.md` | Ít nhất 3 lỗi có phân tích |

## Phụ thuộc giữa các task
```
0.x → 1.x → 2.1–2.3 → 2.4, 2.5 → 3.x → 4.x → 5.x
                                         ↘ 5.6 (ghi dần trong suốt quá trình)
```