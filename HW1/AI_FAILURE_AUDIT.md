# AI Failure Audit — HW1 Photo Gallery

> "Generate with AI. Verify with Engineering."
> Tài liệu ghi lại các chỗ code do AI sinh ra (hoặc code mẫu trên slide) sai / thiếu, cách phát hiện và cách sửa.

## Tổng quan
| # | Lỗi | Mức độ | Phát hiện bằng | Trạng thái |
|---|---|---|---|---|
| F1 | `setSearchParams({})` xoá mất bộ lọc khi đóng lightbox | Cao | Test thủ công deep link | Đã sửa |
| F2 | `onClose` của `<dialog>` bị gọi 2 lần → vòng lặp cập nhật URL | Cao | StrictMode + nút Back | Đã sửa |
| F3 | Không trả focus về thumbnail sau khi đóng dialog | Cao (WCAG 2.4.3) | Test chỉ dùng bàn phím | Đã sửa |
| F4 | `id` kiểu number so sánh với `searchParams.get()` (string) | Trung bình | Dialog không mở khi vào link | Đã sửa |
| F5 | `showModal()` gọi khi dialog đã mở → `InvalidStateError` | Trung bình | Console ở StrictMode | Đã sửa |
| F6 | `loading="lazy"` cho mọi ảnh → LCP chậm | Trung bình | Lighthouse Performance | Đã sửa |
| F7 | Import từ `react-router-dom` thay vì `react-router` (v7) | Thấp | Đọc tài liệu Router v7 | Đã sửa |
| F8 | Không validate giá trị URL (`?category=abc`) → lưới rỗng | Thấp | Test URL sai | Đã sửa |

---

## F1 — Đóng lightbox làm mất bộ lọc
**Code AI / slide 30:**
```jsx
<dialog ref={dialogRef} onClose={() => setSearchParams({})}>
```
**Vấn đề:** `setSearchParams({})` thay toàn bộ query string bằng rỗng. Đang ở `?category=food&photoId=7`, đóng ảnh → về `/gallery` → mất bộ lọc "Ẩm thực".
**Sửa:** chỉ xoá đúng `photoId`, giữ param khác:
```jsx
setSearchParams((prev) => {
  const next = new URLSearchParams(prev);
  next.delete('photoId');
  return next;
}, { replace: true });
```
**Bài học:** Với URL state, luôn cập nhật từng param thay vì ghi đè cả object.

## F2 — `onClose` bị gọi lặp
**Code AI:** effect gọi `dialog.close()` khi `photoId` mất, đồng thời `onClose` lại gọi `setSearchParams`.
**Vấn đề:** `dialog.close()` cũng phát sự kiện `close` → `onClose` chạy thêm lần nữa → thêm một lần điều hướng thừa; khi bấm Back của trình duyệt có thể tạo history rác.
**Sửa:** chỉ đồng bộ ngược lên URL khi URL vẫn còn `photoId`:
```jsx
const handleClose = () => {
  if (isOpen) onClose();
  ...
};
```

## F3 — Mất focus sau khi đóng dialog
**Code AI:** không có xử lý focus, phụ thuộc trình duyệt.
**Vấn đề:**
- Khi mở từ deep link, không có phần tử "trước đó" → focus rơi về `<body>`.
- Sau khi bấm Prev/Next, ảnh đang xem khác ảnh đã bấm → focus quay về sai thumbnail.
Vi phạm WCAG 2.4.3 (Focus Order).
**Sửa:** lưu `lastPhotoIdRef`, gắn `data-photo-id` cho thumbnail, sau khi đóng:
```jsx
requestAnimationFrame(() => {
  document.querySelector(`[data-photo-id="${id}"]`)?.focus();
});
```

## F4 — So sánh number với string
**Code AI:** `{ id: 1, ... }` và `photos.find(p => p.id === searchParams.get('photoId'))`.
**Vấn đề:** `searchParams.get()` luôn trả về string → `1 === '1'` là `false` → link `?photoId=1` không mở được ảnh.
**Sửa:** lưu `id` dạng string trong `photos.js` (thay vì ép kiểu rải rác).

## F5 — `InvalidStateError` khi `showModal()`
**Code AI:**
```jsx
useEffect(() => {
  if (selectedPhotoId) dialogRef.current?.showModal();
  else dialogRef.current?.close();
}, [selectedPhotoId]);
```
**Vấn đề:** dependency là `selectedPhotoId` → bấm Prev/Next đổi id → effect gọi `showModal()` trên dialog **đang mở** → lỗi `InvalidStateError`.
**Sửa:** phụ thuộc vào boolean `isOpen` và kiểm tra `dialog.open` trước khi gọi:
```jsx
if (isOpen && !dialog.open) dialog.showModal();
else if (!isOpen && dialog.open) dialog.close();
```

## F6 — Lazy-load cả ảnh trên màn hình đầu
**Code AI:** `<img loading="lazy" />` cho mọi ảnh.
**Vấn đề:** ảnh LCP bị trì hoãn → Lighthouse cảnh báo "Largest Contentful Paint image was lazily loaded", Performance < 100.
**Sửa:** 3 ảnh đầu `eager`, ảnh đầu `fetchPriority="high"`, còn lại `lazy`; luôn có `width`/`height` để CLS = 0.

## F7 — Sai gói import Router v7
**Code AI:** `import { useSearchParams } from 'react-router-dom';`
**Vấn đề:** Router v7 gộp vào gói `react-router`; `react-router-dom` chỉ còn để tương thích, thêm dependency thừa và không khớp code contract của lab.
**Sửa:** `import { useSearchParams } from 'react-router';`

## F8 — Không validate dữ liệu từ URL
**Code AI:** `const category = searchParams.get('category') ?? 'all';`
**Vấn đề:** URL do người dùng gõ/sửa được; `?category=abc` → lọc ra 0 ảnh, giao diện không có nút nào active.
**Sửa:** kiểm tra với tập hợp hợp lệ:
```jsx
const category = VALID_CATEGORIES.has(raw) ? raw : 'all';
```

---

## Quy trình kiểm chứng đã dùng
1. Đọc lại từng dòng code AI sinh ra, đối chiếu tài liệu chính thức (MDN `<dialog>`, React Router v7).
2. Bật `StrictMode` để lộ lỗi effect chạy hai lần.
3. Test thủ công: copy deep link sang tab mới, bấm Back/Forward, chỉ dùng bàn phím.
4. Công cụ: ESLint `jsx-a11y`, axe DevTools, Lighthouse trên bản build.

## Kết luận
AI viết nhanh phần khung nhưng thường sai ở **ranh giới giữa URL state và DOM API** (F1, F2, F5) và **accessibility chi tiết** (F3). Mọi đoạn code liên quan đến đồng bộ trạng thái và focus đều phải được test thủ công, không tin vào code mẫu.