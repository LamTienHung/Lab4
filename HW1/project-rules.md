- `pages/` là nơi DUY NHẤT được gọi `useSearchParams()`.
- `components/` chỉ nhận props + callback, không tự đọc URL.

## 3. Quy tắc State
1. **URL là nguồn sự thật duy nhất** cho `category` và `photoId`. Không sao chép vào `useState`.
2. Mọi giá trị suy ra được (danh sách đã lọc, ảnh đang chọn, vị trí) phải là **derived state** tính trong lúc render.
3. Cập nhật URL luôn dùng dạng hàm `setSearchParams(prev => ...)` và tạo `new URLSearchParams(prev)` để **không làm mất param khác**.
4. Đóng lightbox / chuyển ảnh dùng `{ replace: true }`; mở ảnh thì push để nút Back đóng được ảnh.
5. Giá trị từ URL phải được **validate** (category không hợp lệ → `all`, photoId không tồn tại → không mở dialog).

## 4. Quy tắc Accessibility (WCAG 2.2 AA)
- Phần tử bấm được phải là `<button>` hoặc `<a>`; cấm `onClick` trên `<div>`/`<span>`.
- Mọi `<img>` có `alt` mô tả nội dung (không lặp `title`, không ghi "ảnh của…").
- Modal bắt buộc dùng `<dialog>` + `showModal()`; có `aria-labelledby`; đóng được bằng Esc; **trả focus về phần tử đã mở**.
- Không ẩn outline focus; dùng `:focus-visible` tương phản ≥ 3:1.
- Màu chữ/nền ≥ 4.5:1; vùng bấm ≥ 24×24px (dự án dùng 44px).
- Trạng thái không chỉ thể hiện bằng màu (dùng `aria-pressed`, chữ đậm).
- Tôn trọng `prefers-reduced-motion`.

## 5. Quy tắc Performance (Lighthouse 100)
- Ảnh dạng `.webp`, ≤ ~80KB, luôn khai báo `width`/`height`.
- 3 ảnh đầu `loading="eager"`, ảnh đầu `fetchPriority="high"`; còn lại `lazy`.
- Không thêm thư viện UI/animation ngoài.
- Đo Lighthouse trên bản build (`npm run build && npm run preview`), cửa sổ ẩn danh.

## 6. Quy ước đặt tên
- Component: `PascalCase.jsx`; hàm/biến: `camelCase`; hằng: `UPPER_SNAKE_CASE`.
- Handler props: `onXxx` (`onOpen`, `onClose`); hàm nội bộ: `handleXxx`.
- `id` dữ liệu là **string** để so sánh trực tiếp với giá trị URL.

## 7. Git
- Commit theo Conventional Commits: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
- Mỗi commit một thay đổi logic; không commit `node_modules`, `dist`, `.env`.

## 8. Checklist trước khi nộp
- [ ] `npm run lint` không lỗi
- [ ] Copy URL `?category=food&photoId=7` sang tab mới → mở đúng ảnh
- [ ] Bấm Back khi đang xem ảnh → đóng ảnh, giữ bộ lọc
- [ ] Chỉ dùng bàn phím: Tab → Enter mở ảnh → ←/→ → Esc → focus về đúng thumbnail
- [ ] Lighthouse: Performance / Accessibility / Best Practices / SEO = 100
- [ ] Kiểm tra bằng axe DevTools: 0 lỗi