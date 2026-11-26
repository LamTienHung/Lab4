# Project Rules — HW2 Card-Swipe Deck "Hẹn Hò Nhưng Không Yêu"

Quy tắc code & kiểm tra chất lượng cho HW2 (Lab 4 – Full-Stack Contracts).

## 1. Stack & phiên bản
| Phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 19 + Vite 6 | Function component + hooks |
| Backend | Express 5 | ES Modules (`"type": "module"`) |
| Database | MongoDB + Mongoose 8 | Không dùng flag deprecated |
| Môi trường | Node ≥ 20.6 | Dùng `--env-file`, không cần `dotenv` |

## 2. Cấu trúc thư mục
~~~
HW2/
├── .env.example        # mẫu biến môi trường (commit)
├── .env                # giá trị thật (KHÔNG commit)
├── client/src/
│   ├── api/            # toàn bộ lời gọi fetch
│   ├── hooks/          # logic + state (useSwipeDeck)
│   ├── components/     # chỉ hiển thị, nhận props
│   └── styles/
└── server/
    ├── models/         # Mongoose schema
    ├── server.js       # route Express
    └── seed.js         # dữ liệu mẫu
~~~
- Component **không** gọi `fetch` trực tiếp; mọi request đi qua `api/swipeApi.js`.
- Component **không** tính điểm; mọi tính toán nằm trong hook.

## 3. Quy tắc State (Frontend)
1. **Một nguồn sự thật duy nhất:** `history` (LIFO stack). Thẻ hiện tại, điểm, thống kê, trạng thái kết thúc đều là **derived state**.
2. Push: `[...prev, entry]` — Pop: `prev.slice(0, -1)`. Không dùng `push/pop` trực tiếp (mutate state).
3. **Optimistic update + rollback:** cập nhật UI trước, gọi API sau; API lỗi thì hoàn tác thay đổi và hiện thông báo.
4. Khoá `busyRef`: mỗi lúc chỉ 1 request để stack client và server luôn khớp.
5. Effect gọi API phải dùng `AbortController` và cleanup.

## 4. Quy tắc Backend
1. Kiểm tra `MONGODB_URI` khi khởi động, thiếu thì dừng ngay.
2. `mongoose.connect(uri)` không kèm `useNewUrlParser` / `useUnifiedTopology`.
3. Mọi handler dùng `async/await`; route ghi dữ liệu có `try/catch`.
4. Chỉ lấy đúng các trường cần thiết từ `req.body` (không `create(req.body)`).
5. Mã trạng thái: `201` tạo mới, `400` dữ liệu sai, `404` không tìm thấy, `500` lỗi máy chủ.
6. Đọc dữ liệu dùng `.lean()`.

## 5. API Contract
| Method | Endpoint | Body / Query | Thành công |
|---|---|---|---|
| GET | `/api/profiles` | — | `200` mảng Profile |
| GET | `/api/swipes` | `?sessionId=` | `200` mảng Swipe |
| POST | `/api/swipe` | `{ profileId, type, sessionId }` | `201` Swipe vừa tạo |
| DELETE | `/api/swipe/last` | `?sessionId=` | `200` Swipe vừa xoá |

`type` ∈ `LIKE | NOPE | SUPER`. Điểm: LIKE +10, SUPER +25, NOPE −5.

## 6. Quy tắc Accessibility (WCAG 2.2 AA)
- Mọi thao tác kéo có nút thay thế (2.5.7 Dragging Movements).
- Bộ thẻ nhận focus (`tabIndex={0}`), có `aria-describedby` hướng dẫn phím.
- Kết quả mỗi lượt quẹt được thông báo qua `aria-live`.
- Nút ≥ 48px, tương phản chữ ≥ 4.5:1, focus ring rõ ràng.
- `touch-action: none` trên vùng kéo; tôn trọng `prefers-reduced-motion`.

## 7. Bảo mật
- Không commit `.env`; chỉ commit `.env.example` với giá trị trống.
- Giới hạn body JSON `10kb`.
- Validate `ObjectId` trước khi truy vấn.

## 8. Git
- Conventional Commits: `feat:`, `fix:`, `style:`, `docs:`, `chore:` (scope `hw2`).
- Không commit `node_modules`, `dist`, `.env`.

## 9. Checklist trước khi nộp
- [x] `npm run seed` tạo 8 hồ sơ
- [x] Thích / Siêu thích / Bỏ qua cộng trừ điểm đúng
- [x] Hoàn tác trả lại thẻ và điểm
- [x] F5 giữ nguyên tiến độ (dữ liệu lưu MongoDB)
- [x] Phím ← → ↑ Backspace và kéo chuột hoạt động
- [x] Tắt server → quẹt thẻ → hiện lỗi và thẻ trả về
- [x] `npm run lint` không lỗi