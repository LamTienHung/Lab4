# Task Decomposition — HW2 Card-Swipe Deck

**Mục tiêu:** Trò chơi quẹt thẻ full-stack: điều khiển bằng bàn phím + pointer, Undo theo stack LIFO, điểm bất đối xứng tính bằng derived state, dữ liệu lưu bằng Express + Mongoose 8.

## Sprint 0 — Môi trường
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 0.1 | Cài MongoDB Server, chạy dưới dạng Windows Service | — | `Get-Service MongoDB` = Running |
| 0.2 | Mẫu biến môi trường | `.env.example` | Có `MONGODB_URI`, `PORT`, `CLIENT_ORIGIN` |
| 0.3 | Quy tắc dự án | `project-rules.md` | Có API contract, quy tắc state |

## Sprint 1 — Backend: Model
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 1.1 | Khởi tạo server (ESM, Express 5, Mongoose 8) | `server/package.json` | `npm install` thành công |
| 1.2 | Schema Profile + validate (tuổi ≥ 18, độ dài) | `server/models/Profile.js` | Lưu tuổi 15 → báo lỗi |
| 1.3 | Schema Swipe (`enum` type, `ref` Profile, `sessionId`) | `server/models/Swipe.js` | `type: "HATE"` → báo lỗi |
| 1.4 | Script tạo dữ liệu mẫu | `server/seed.js` | `npm run seed` tạo 8 hồ sơ |

## Sprint 2 — Backend: API
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 2.1 | Env guard + `mongoose.connect` không flag cũ | `server/server.js` | Thiếu `.env` → dừng với thông báo rõ |
| 2.2 | `GET /api/profiles` (`.lean()`) | như trên | Trả 8 hồ sơ |
| 2.3 | `POST /api/swipe` (try/catch, 201/400/404) | như trên | Body sai → 400 |
| 2.4 | `GET /api/swipes?sessionId=` | như trên | Trả lịch sử đúng phiên |
| 2.5 | `DELETE /api/swipe/last` (LIFO) | như trên | Xoá đúng bản ghi mới nhất |

## Sprint 3 — Frontend: Dữ liệu & Logic
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 3.1 | Khởi tạo client + proxy `/api` | `client/package.json`, `vite.config.js` | Gọi `/api/profiles` không lỗi CORS |
| 3.2 | HTML khung (`lang`, meta, preconnect) | `client/index.html` | — |
| 3.3 | Lớp gọi API + sessionId | `client/src/api/swipeApi.js` | Lỗi server hiện đúng message |
| 3.4 | Hook: stack `history`, swipe, undo, restart | `client/src/hooks/useSwipeDeck.js` | Không có state thừa |
| 3.5 | Derived state: thẻ hiện tại, điểm, thống kê | như trên | Điểm luôn khớp lịch sử |
| 3.6 | Optimistic update + rollback + khoá `busyRef` | như trên | Tắt server → thẻ trả về |
| 3.7 | Khôi phục lịch sử khi F5 | như trên | F5 giữ nguyên điểm |

## Sprint 4 — Frontend: Giao diện & Tương tác
| # | Task | File | Tiêu chí hoàn thành |
|---|---|---|---|
| 4.1 | Thẻ hồ sơ (nghiêng theo tay, nhãn gợi ý) | `components/ProfileCard.jsx` | Kéo hiện LIKE/NOPE/SUPER |
| 4.2 | Bảng điểm `<dl>` + `aria-live` | `components/ScoreBoard.jsx` | Screen reader đọc kết quả |
| 4.3 | Bàn phím ← → ↑ Backspace | `components/SwipeDeck.jsx` | Không cuộn trang, không back trang |
| 4.4 | Pointer: capture, ngưỡng 100px, cancel | như trên | Kéo ra ngoài thẻ vẫn nhận |
| 4.5 | Nút thay thế thao tác kéo | như trên | Dùng được không cần kéo |
| 4.6 | Ghép trạng thái loading / error / ready / finished | `App.jsx`, `main.jsx` | Mỗi trạng thái hiển thị đúng |
| 4.7 | CSS: xếp chồng thẻ, `touch-action`, tương phản | `styles/deck.css` | Dùng tốt trên mobile |

## Sprint 5 — Kiểm thử & Nộp bài
| # | Task | Cách kiểm tra | Tiêu chí hoàn thành |
|---|---|---|---|
| 5.1 | Luồng chính | Thích → Siêu thích → Bỏ qua → Hoàn tác | Điểm 10 → 35 → 30 → 35 |
| 5.2 | Persistence | F5 sau khi quẹt | Giữ nguyên tiến độ |
| 5.3 | Xử lý lỗi | Tắt server rồi quẹt | Hiện lỗi, thẻ trả về |
| 5.4 | Bàn phím & pointer | Thủ công | Tất cả thao tác hoạt động |
| 5.5 | Lint + axe DevTools | `npm run lint`, axe | 0 lỗi |
| 5.6 | Ghi lỗi AI & cách sửa | `AI_FAILURE_AUDIT.md` | Có phân tích từng lỗi |

## Phụ thuộc giữa các task
~~~
0.x → 1.x → 2.x ─┐
                 ├→ 3.4–3.7 → 4.x → 5.x
      3.1–3.3 ───┘                 ↘ 5.6 (ghi dần)
~~~