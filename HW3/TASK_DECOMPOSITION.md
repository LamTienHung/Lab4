# Task Decomposition — HW3 Esports Fair-Play Appeal Tribunal

**Mục tiêu:** SPA nhiều route cho hồ sơ kháng cáo Himass & TanVuu: route động `/dossier/:playerID`, form kháng cáo dùng Context với validate real-time, đồng hồ SLA không trôi `useAppealSlaTimer()`, ma trận tương xứng án phạt, và báo cáo `AI_FAILURE_AUDIT.md`.

## Sprint 0 — Khởi tạo
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 0.1 | Project Vite + React 19 + Router v7 | `package.json`, `vite.config.js` | `npm run dev` chạy được |
| 0.2 | HTML khung | `index.html` | Có `lang`, `description` |
| 0.3 | Quy tắc dự án | `project-rules.md` | Có quy tắc routing, timer, form |

## Sprint 1 — Dữ liệu & Logic thuần
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 1.1 | Dữ liệu hồ sơ hư cấu + bảng tiền lệ | `src/data/dossiers.js` | 2 hồ sơ, mỗi hồ sơ 3 vi phạm |
| 1.2 | Hạn SLA tính tương đối theo lúc mở app | như trên | TanVuu ~2h, Himass ~26h |
| 1.3 | Hàm thuần `computeMatrix` (delta, ratio, verdict, index) | `src/utils/computeMatrix.js` | Himass 2.50×, TanVuu 1.25× |
| 1.4 | Xử lý chia 0 khi tiền lệ = 0 | như trên | Không ra `NaN` / `Infinity` |

## Sprint 2 — SLA Timer
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 2.1 | Tính `deadline - Date.now()` mỗi tick | `src/hooks/useAppealSlaTimer.js` | Không cộng dồn sai số |
| 2.2 | Tick căn đầu giây bằng `setTimeout` chuỗi | như trên | Giây nhảy đều |
| 2.3 | Đồng bộ lại khi `visibilitychange` | như trên | Ẩn tab 1 phút → đúng ngay |
| 2.4 | Derived: `isExpired`, `isUrgent`, h/m/s | như trên | < 6h → khẩn cấp |
| 2.5 | Hiển thị đồng hồ, trạng thái, `<progress>` | `components/SlaCountdown.jsx` | `role="timer"`, không đọc mỗi giây |

## Sprint 3 — Form Engine (Context)
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 3.1 | Provider: values, touched, status, receipt | `src/context/AppealFormContext.jsx` | — |
| 3.2 | `validate()` thuần → errors là derived state | như trên | Gõ phím → lỗi cập nhật ngay |
| 3.3 | Liên kết SLA: hết hạn → chặn nộp | như trên | Có lỗi `form` khi hết hạn |
| 3.4 | Ô nhập dùng chung (`useId`, aria) | `components/FormField.jsx` | Label liên kết đúng ô |
| 3.5 | Form: checkbox vi phạm, select, textarea, xác nhận | `components/AppealForm.jsx` | Nộp rỗng → banner + focus |
| 3.6 | Biên nhận sau khi nộp | như trên | Có mã đơn, thời điểm |

## Sprint 4 — Routing & Giao diện
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 4.1 | Bảng ma trận (`caption`, `scope`, `tfoot`) | `components/DisproportionalityMatrix.jsx` | axe không báo lỗi bảng |
| 4.2 | Trang hồ sơ: `useParams`, `useMemo`, 404 | `pages/DossierView.jsx` | `/dossier/abc` → 404 |
| 4.3 | Reset form khi đổi hồ sơ (`key`) | như trên | Không dính dữ liệu cũ |
| 4.4 | Trang 404 có link gợi ý | `pages/NotFound.jsx` | — |
| 4.5 | Layout `NavLink` + `<Outlet />` + tổng quan | `pages/FairPlayAppealPortal.jsx` | Hồ sơ đang mở được tô đậm |
| 4.6 | Khai báo nested routes + `errorElement` | `App.jsx`, `main.jsx` | — |
| 4.7 | CSS: trạng thái SLA, bảng, form, responsive | `styles/tribunal.css` | Dùng tốt ở màn 360px |

## Sprint 5 — Kiểm thử & Nộp bài
| # | Task | Cách kiểm tra | Tiêu chí hoàn thành |
|---|---|---|---|
| 5.1 | Luồng điều hướng | `/` → TanVuu → Himass → `/dossier/abc` | Đúng trang, đúng tiêu đề tab |
| 5.2 | Form | Nộp rỗng → điền đủ → nộp | Banner lỗi → biên nhận |
| 5.3 | Timer | Ẩn tab 1 phút | Đồng hồ đúng ngay khi quay lại |
| 5.4 | Chỉ dùng bàn phím | Tab qua menu, form, bảng | Mọi thao tác dùng được |
| 5.5 | Lint + axe + Lighthouse | Công cụ | 0 lỗi |
| 5.6 | Báo cáo lỗi AI | `AI_FAILURE_AUDIT.md` | Phân tích từng lỗi |

## Phụ thuộc giữa các task
~~~
0.x → 1.x ─┬→ 2.x ─┐
           ├→ 3.x ─┼→ 4.2–4.3 → 4.5–4.7 → 5.x
           └→ 4.1 ─┘                    ↘ 5.6 (ghi dần)
~~~