# AI Failure Audit — HW2 Card-Swipe Deck

> "Generate with AI. Verify with Engineering."
> Ghi lại các chỗ code mẫu (slide 31–32) và code AI sinh ra bị sai / thiếu, cách phát hiện và cách sửa.

## Tổng quan
| # | Lỗi | Phần | Mức độ | Phát hiện bằng | Trạng thái |
|---|---|---|---|---|---|
| F1 | Undo chỉ xoá ở client, DB vẫn còn bản ghi | FE + BE | Cao | F5 sau khi Undo | Đã sửa |
| F2 | Siêu thích (SUPER) bị tính −5 điểm | FE | Cao | Test bảng điểm | Đã sửa |
| F3 | `startPos` null → crash khi thả chuột | FE | Cao | Nhấn ngoài thẻ, thả trên thẻ | Đã sửa |
| F4 | `Swipe.create(req.body)` — ghi mọi trường client gửi | BE | Cao | Đọc code | Đã sửa |
| F5 | Không rollback khi API lỗi → UI lệch với DB | FE | Cao | Tắt server rồi quẹt | Đã sửa |
| F6 | `history` lưu hướng (`left`) nhưng tính điểm theo `type` (`LIKE`) | FE | Trung bình | Điểm luôn −5 | Đã sửa |
| F7 | Phím mũi tên cuộn trang, Backspace quay lại trang trước | FE | Trung bình | Test bàn phím | Đã sửa |
| F8 | Không có cử chỉ kéo lên (SUPER), mất sự kiện khi kéo nhanh | FE | Trung bình | Test chuột / cảm ứng | Đã sửa |
| F9 | `profileId` sai định dạng → lỗi 500 thay vì 400 | BE | Trung bình | Gửi request sai | Đã sửa |
| F10 | AI thêm `useNewUrlParser` / `useUnifiedTopology` | BE | Thấp | Đọc tài liệu Mongoose 8 | Đã sửa |
| F11 | StrictMode gọi API 2 lần khi tải trang | FE | Thấp | Tab Network | Đã sửa |
| F12 | Bấm nhanh liên tục → request chồng nhau, stack lệch | FE | Thấp | Spam phím | Đã sửa |

---

## F1 — Undo không xoá trong database
**Code slide 31:**
```js
const undoLastSwipe = () => {
  setHistory(prev => prev.slice(0, -1));
};
```
**Vấn đề:** Chỉ pop stack ở client. Bản ghi vẫn nằm trong MongoDB → F5 thì thẻ vừa hoàn tác lại biến mất, điểm sai.
**Sửa:** thêm endpoint xoá bản ghi mới nhất của phiên (LIFO phía server):
```js
app.delete('/api/swipe/last', async (req, res) => {
  const last = await Swipe.findOneAndDelete({ sessionId }, { sort: { createdAt: -1 } });
  ...
});
```
và client gọi `deleteLastSwipe(sessionId)` sau khi pop.

## F2 — SUPER bị trừ điểm
**Code slide 31:**
```js
if (action.type === 'LIKE') return acc + 10;
else return acc - 5;
```
**Vấn đề:** Mọi thứ không phải `LIKE` đều −5 → quẹt lên (SUPER) bị trừ điểm.
**Sửa:** bảng điểm tường minh:
```js
export const SCORE_TABLE = { LIKE: 10, SUPER: 25, NOPE: -5 };
const score = history.reduce((sum, h) => sum + SCORE_TABLE[h.type], 0);
```

## F3 — Crash do `startPos` null
**Code slide 31:**
```js
const handlePointerUp = (e) => {
  const dx = e.clientX - startPos.x; // startPos có thể null
```
**Vấn đề:** Nhấn chuột ngoài thẻ rồi thả trên thẻ → `pointerdown` không chạy → `TypeError: Cannot read properties of null`.
**Sửa:** `if (!startPos) return;` ở đầu hàm.

## F4 — Mass assignment
**Code slide 32:** `const record = await Swipe.create(req.body);`
**Vấn đề:** Client có thể gửi thêm trường bất kỳ (`createdAt`, `_id`…) và chúng được ghi vào DB.
**Sửa:** chỉ lấy đúng trường cần:
```js
const { profileId, type, sessionId } = req.body;
await Swipe.create({ profileId, type, sessionId });
```

## F5 — Không rollback khi lỗi
**Vấn đề:** Code AI cập nhật UI rồi gọi API, không xử lý thất bại. Server tắt → UI báo đã quẹt nhưng DB không có → F5 mất dữ liệu.
**Sửa:** optimistic update có rollback:
```js
setHistory(prev => [...prev, entry]);
try { await postSwipe(...); }
catch { setHistory(prev => prev.slice(0, -1)); setError(...); }
```

## F6 — Lệch giữa hướng quẹt và loại swipe
**Vấn đề:** Slide gọi `swipe('left' | 'right' | 'up')` nhưng tính điểm theo `action.type === 'LIKE'` → không bao giờ khớp, điểm luôn âm.
**Sửa:** ánh xạ tường minh `DIRECTION_TO_TYPE = { left: 'NOPE', right: 'LIKE', up: 'SUPER' }` và chỉ lưu `type` vào stack.

## F7 — Phím mặc định của trình duyệt
**Vấn đề:** ↑/↓ cuộn trang; Backspace ở một số trình duyệt quay lại trang trước; giữ phím → quẹt liên tục hết bộ thẻ.
**Sửa:** `e.preventDefault()` cho phím đã xử lý, bỏ qua `e.repeat`.

## F8 — Pointer chưa hoàn chỉnh
**Vấn đề:** Slide chỉ xét `dx` (không có SUPER bằng pointer); kéo nhanh ra ngoài thẻ mất `pointerup`; trên điện thoại trình duyệt chiếm cử chỉ để cuộn.
**Sửa:** xét cả `dy`, `setPointerCapture`, xử lý `onPointerCancel`, CSS `touch-action: none`.

## F9 — ObjectId không hợp lệ
**Vấn đề:** `profileId: "abc"` → Mongoose ném `CastError` → 500.
**Sửa:** `mongoose.isValidObjectId(profileId)` → 400; kiểm tra tồn tại → 404.

## F10 — Flag kết nối đã bị loại bỏ
**Code AI thường sinh:**
```js
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
```
**Vấn đề:** Hai flag này không còn tác dụng từ MongoDB Driver 4 / Mongoose 6, đúng như slide 32 yêu cầu loại bỏ.
**Sửa:** `await mongoose.connect(MONGODB_URI);`

## F11 — Gọi API hai lần
**Vấn đề:** StrictMode chạy effect 2 lần ở dev → 2 request tải dữ liệu.
**Sửa:** `AbortController` + `return () => controller.abort();` → request đầu bị huỷ.

## F12 — Race condition khi thao tác nhanh
**Vấn đề:** Quẹt rồi Undo ngay khi request quẹt chưa xong → DELETE có thể chạy trước POST → server xoá nhầm bản ghi cũ.
**Sửa:** khoá `busyRef` — chỉ cho phép 1 request tại một thời điểm.

---

## Quy trình kiểm chứng đã dùng
1. Đối chiếu code slide với yêu cầu đề (LIFO thật sự, điểm bất đối xứng, persistence).
2. Test thủ công: luồng Thích → Siêu thích → Bỏ qua → Hoàn tác (điểm 10 → 35 → 30 → 35), F5, tắt server.
3. DevTools: tab Network kiểm tra request/status code; Console kiểm tra lỗi.
4. Đọc tài liệu chính thức Mongoose 8, Express 5, MDN Pointer Events.

## Kết luận
Code mẫu đúng về **hình dạng** (có stack, có reduce, có endpoint) nhưng sai ở **tính toàn vẹn dữ liệu giữa client và server** (F1, F5, F12) và **chi tiết nghiệp vụ** (F2, F6). Mọi thao tác ghi dữ liệu đều phải được kiểm tra bằng F5 — UI đúng chưa chắc DB đúng.