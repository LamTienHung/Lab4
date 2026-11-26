# Project Rules — HW3 Esports Fair-Play Appeal Tribunal

Quy tắc code & kiểm tra chất lượng cho HW3 (Lab 4 – Multi-Route SPA Architecture).

> Toàn bộ dữ liệu hồ sơ là **hư cấu**, phục vụ case study của slide. Không thêm cáo buộc nghiêm trọng (gian lận, hack…) gắn với tên người thật.

## 1. Stack & phiên bản
| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| React | 19 | Dùng `<title>` trong component (React 19 tự đưa lên `<head>`) |
| React Router | 7 | Import từ `react-router`; nested routes + `<Outlet />` |
| Vite | 6 | — |
| ESLint | 9 + `jsx-a11y` | — |

## 2. Cấu trúc thư mục
~~~
src/
├── data/         # dữ liệu tĩnh hồ sơ + bảng tiền lệ
├── utils/        # hàm THUẦN (computeMatrix)
├── hooks/        # useAppealSlaTimer
├── context/      # AppealFormContext (form engine)
├── pages/        # gắn với route, đọc useParams
├── components/   # hiển thị, nhận props / context
└── styles/
~~~

## 3. Quy tắc Routing
1. Một route động duy nhất `dossier/:playerID` cho mọi tuyển thủ — **không** hard-code từng route.
2. ID không tồn tại → render `NotFound` (404 boundary), không để crash.
3. Layout dùng `<Outlet />`; điều hướng dùng `<NavLink>` (tự có `aria-current="page"`).
4. Mỗi trang đặt `<title>` riêng (WCAG 2.4.2).
5. Có `errorElement` cho lỗi render.

## 4. Quy tắc State
1. **Derived state ưu tiên:** lỗi form, ma trận, thời gian còn lại đều tính từ dữ liệu gốc, không lưu riêng.
2. Hàm tính toán nặng bọc `useMemo` (`computeMatrix`).
3. Hook phải gọi **trước** mọi `return` có điều kiện.
4. Provider form đặt `key={dossier.id}` để reset khi đổi hồ sơ.
5. Đồng hồ SLA và form dùng **chung** một kết quả `useAppealSlaTimer` → `isExpired` nhất quán.

## 5. Quy tắc Timer (zero-drift)
- Không đếm lùi `remaining - 1`; luôn tính `deadline - Date.now()`.
- Tick căn theo đầu giây (`1000 - now % 1000`), dùng `setTimeout` chuỗi.
- Lắng nghe `visibilitychange` → đồng bộ ngay khi tab hiện lại.
- Dừng timer khi hết hạn; cleanup listener trong `useEffect`.

## 6. Quy tắc Form
- Validate là hàm thuần `validate(values, ctx)`; chạy mỗi lần render (real-time).
- Chỉ hiển thị lỗi khi ô đã `touched` hoặc đã bấm Nộp.
- Nộp lỗi → banner tổng hợp + focus ô lỗi đầu tiên.
- Khoá form khi đang gửi; chặn nộp 2 lần; chặn nộp khi hết SLA.

## 7. Quy tắc Accessibility (WCAG 2.2 AA)
- Mọi ô có `<label htmlFor>`; id sinh bằng `useId()`.
- Lỗi: `aria-invalid` + `aria-describedby` + `role="alert"` + icon ⚠ (không chỉ màu).
- Nhóm checkbox dùng `<fieldset>` + `<legend>`.
- Bảng có `<caption>`, `scope="col/row"`, vùng cuộn có `tabIndex={0}`.
- Đồng hồ dùng `role="timer"`; chỉ `aria-live` khi **trạng thái** đổi, không đọc mỗi giây.
- Skip link, focus ring rõ, vùng bấm ≥ 44px, tôn trọng `prefers-reduced-motion`.

## 8. Git
- Conventional Commits, scope `hw3`. Không commit `node_modules`, `dist`.

## 9. Checklist trước khi nộp
- [x] `/` hiển thị tổng quan, chỉ số Himass 2.50×, TanVuu 1.25×
- [x] `/dossier/tanvuu`: đồng hồ chạy, trạng thái "Sắp hết hạn"
- [x] Nộp form rỗng → banner lỗi + focus ô đầu tiên
- [x] Nộp hợp lệ → hiện biên nhận
- [x] Đổi hồ sơ → form reset
- [x] `/dossier/abc` → 404
- [x] Ẩn tab rồi quay lại → đồng hồ đúng ngay
- [x] `npm run lint` không lỗi
- [x] axe DevTools: 0 lỗi