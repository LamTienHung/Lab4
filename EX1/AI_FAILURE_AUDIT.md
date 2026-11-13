# AI_FAILURE_AUDIT.md — Lab 4 EX1: Multi-Route SPA

**Công cụ AI đã dùng:** Claude (chat)
**Đã nạp project-rules.md:** Có

---

## Failure #01: `npm install react-router` cài nhầm v8

- **Task:** T0
- **AI Output (bản nháp):** `npm install react react-dom react-router`
- **Bug:** Tại thời điểm làm bài, bản mới nhất trên npm là `react-router@8.x`, trong khi đề yêu cầu React Router v7. Không ghi phiên bản → `package.json` ghi `"react-router": "^8.5.1"`, lệch với contract của slide.
- **Terminal Proof:** `npm ls react-router` → `react-router@8.5.1`.
- **Engineering Fix:** Ghim major version: `npm install react-router@7` → `react-router@7.18.5`; thêm vào rule 1 của `project-rules.md`.
  Commit: `chore(ex1): init react19 vite project with react-router v7`
- **Verify sau fix:** `npm ls react-router` hiển thị 7.x.

---

## Failure #02: Cú pháp React Router v5 (`<Switch>`, `component=`, `exact`)

- **Task:** T2
- **Phát hiện:** Review bản nháp (đối chiếu slide "Top 5 AI Hallucinations" #01).
- **AI Code (bản nháp):**
  ```jsx
  import { Switch, Route } from 'react-router-dom';
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/people/:id" component={PersonDetail} />
  </Switch>
  ```
- **Bug:** `Switch` không còn tồn tại ở v6+ → lỗi build `"Switch" is not exported by react-router`; `component=` bị bỏ qua.
- **Engineering Fix:** `<Routes>` + `element={<... />}` + route lồng nhau với `<Outlet />`, import từ `'react-router'`.
  Commit: `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback`
- **Verify sau fix:** `grep -rn "Switch\|component=\|exact" src/` không có kết quả; build thành công.

---

## Failure #03: NavLink "Trang chủ" luôn sáng ở mọi trang

- **Task:** T2
- **Phát hiện:** Review bản nháp.
- **AI Code (bản nháp):**
  ```jsx
  <NavLink to="/" className={navClass}>Trang chủ</NavLink>
  ```
- **Bug:** Thiếu `end` → "/" khớp tiền tố của mọi đường dẫn → vào /people thì cả "Trang chủ" và "Danh bạ" cùng active, có 2 phần tử `aria-current="page"`.
- **Engineering Fix:** `<NavLink to="/" end ...>`.
- **Verify sau fix:** Console: `document.querySelectorAll('nav [aria-current="page"]')` ở /people chỉ trả về liên kết "Danh bạ" (cộng 1 liên kết hồ sơ khi đang ở /people/:id).

---

## Failure #04: Không có 404 guard → crash khi id sai

- **Task:** T3
- **Phát hiện:** Review bản nháp.
- **AI Code (bản nháp):**
  ```jsx
  const person = people.find((p) => p.id === id);
  return <h2>{person.name}</h2>;
  ```
- **Bug:** Mở /people/xyz → `TypeError: Cannot read properties of undefined (reading 'name')` → toàn bộ app trắng trang.
- **Engineering Fix:** `if (!person) return <section role="alert">404 …</section>;` trước khi đọc thuộc tính, kèm nút quay lại danh bạ.
  Commit: `feat(ex1): add detail route handling with 404 guard`
- **Verify sau fix:** /people/xyz hiện "404 — Không tìm thấy hồ sơ", Console sạch.

---

## Failure #05: Code mẫu dùng div-soup và lồng 2 thẻ `<main>`

- **Task:** T2
- **Phát hiện:** Review code contract trên slide (PeopleLayout.jsx).
- **AI Code (theo slide):**
  ```jsx
  <div className="people-frame">
    <nav className="sidebar">…</nav>
    <main className="content-area"><Outlet /></main>
  </div>
  ```
- **Bug:** Layout gốc đã có `<main>` → trang có 2 landmark `main` (Lighthouse/axe: "Document should not have more than one main landmark"); `<div>` vi phạm rule zero div-soup.
- **Engineering Fix:** PeopleLayout dùng `<section aria-labelledby>` + `<nav>`; `<Outlet />` đặt trực tiếp làm cột thứ hai của grid.
- **Verify sau fix:** Console: `document.querySelectorAll('main').length === 1`, `document.querySelectorAll('#root div').length === 0`.

---

## Tổng kết

| # | Lỗi | Phát hiện bằng | Commit fix |
|---|-----|----------------|------------|
| 01 | Cài nhầm React Router v8 | `npm ls` | `chore(ex1): init react19 vite project with react-router v7` |
| 02 | Cú pháp v5 `<Switch>` | Review + build | `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback` |
| 03 | NavLink "/" thiếu `end` | Review + aria-current | `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback` |
| 04 | Thiếu 404 guard | Review + /people/xyz | `feat(ex1): add detail route handling with 404 guard` |
| 05 | Div-soup, 2 `<main>` | Review slide + Elements | `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback` |

**Bài học:** AI và code mẫu thường chỉ đúng ở "đường đi chính". Phải tự kiểm tra phiên bản thư viện thực tế được cài, các trường hợp đường dẫn sai, và cấu trúc landmark của cả trang chứ không chỉ từng component.


---

# Phần 2 — Exercise 1.3: Context Form Engine

## Failure #06: Validate bằng chuỗi useEffect (waterfall)

- **Task:** T6
- **Phát hiện:** Review bản nháp (đối chiếu slide "Legacy Validation Anti-Patterns").
- **AI Code (bản nháp):**
  ```jsx
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  useEffect(() => { setErrors(validateForm(values)); }, [values]);
  useEffect(() => { setIsValid(Object.keys(errors).length === 0); }, [errors]);
  ```
- **Bug:** Mỗi phím gõ gây 3 lần render (values → errors → isValid); render đầu hiển thị lỗi cũ; nút Gửi đọc `isValid` lỗi thời.
- **Engineering Fix:** `const allErrors = validateForm(values)` và `isValid` tính trực tiếp trong render.
  Commit: `feat(ex1.3): add form context and synchronous validation`
- **Verify sau fix:** React Profiler → gõ 1 ký tự → đúng 1 commit render.

## Failure #07: `role="alert"` trên từng field → screen reader đọc dồn

- **Task:** T7
- **Phát hiện:** Review code contract InputField trên slide.
- **AI Code (theo slide):**
  ```jsx
  {error && <span id={errorId} role="alert">{error}</span>}
  ```
- **Bug:** Bấm Gửi khi form trống → 7 alert xuất hiện cùng lúc, screen reader đọc liên tiếp cả 7 và ngắt nhau; ngoài ra lỗi hiện ngay khi chưa gõ gì.
- **Engineering Fix:** Lỗi từng field chỉ nối qua `aria-describedby` (được đọc khi focus vào field); 1 vùng `<output role="status">` tóm tắt "Còn N lỗi"; focus chuyển tới field lỗi đầu tiên; lỗi chỉ hiện sau khi blur hoặc bấm Gửi.
  Commit: `feat(ex1.3): add InputField with useId and aria error binding`
- **Verify sau fix:** Gửi form trống → `document.querySelectorAll('[role=alert]').length === 0`, focus ở ô "Họ tên".

## Failure #08: Thiếu validate chéo "Nhập lại mật khẩu"

- **Task:** T6
- **Phát hiện:** Review bản nháp (đối chiếu challenge "Cross-Field Validation" trong Live Defense).
- **AI Code (bản nháp):**
  ```js
  if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
  ```
- **Bug:** Nhập `abc12345` và `abc12344` → form vẫn hợp lệ.
- **Engineering Fix:** Thêm `else if (values.confirmPassword !== values.password)` ngay trong `validateForm` — vẫn đồng bộ, không cần effect.
  Commit: `feat(ex1.3): add form context and synchronous validation`
- **Verify sau fix:** Nhập 2 mật khẩu khác nhau → lỗi "Mật khẩu nhập lại không khớp."

## Failure #09: ShowData dùng `<div>` trong `<dl>` và lộ mật khẩu

- **Task:** T8
- **Phát hiện:** Review code contract ShowData trên slide.
- **AI Code (theo slide):**
  ```jsx
  <div key={key} className="data-row"><dt>{key}</dt><dd>{String(val)}</dd></div>
  ```
- **Bug:** Vi phạm rule zero div-soup; mật khẩu hiển thị dạng chữ thường trên màn hình; tên field là key kỹ thuật (`confirmPassword`).
- **Engineering Fix:** `<Fragment key>` bọc cặp `<dt>/<dd>`; nhãn tiếng Việt qua `LABELS`; mật khẩu thay bằng `•`.
  Commit: `feat(ex1.3): add SimpleForm route with ShowData inspector`
- **Verify sau fix:** Gửi form đúng → bảng "Dữ liệu đã gửi" hiện `••••••••`, `document.querySelectorAll('#root div').length === 0`.

| # | Lỗi | Phát hiện bằng | Commit fix |
|---|-----|----------------|------------|
| 06 | useEffect waterfall | Review + Profiler | `feat(ex1.3): add form context and synchronous validation` |
| 07 | role="alert" từng field | Review slide + screen reader | `feat(ex1.3): add InputField with useId and aria error binding` |
| 08 | Thiếu validate chéo | Review + nhập thử | `feat(ex1.3): add form context and synchronous validation` |
| 09 | div trong dl, lộ mật khẩu | Review slide + Elements | `feat(ex1.3): add SimpleForm route with ShowData inspector` |

---

# Phần 3 — Exercise 1.7.1: Full-Stack Forum

## Failure #10: Fetch không huỷ → race condition khi đổi kênh nhanh

- **Task:** T12
- **Phát hiện:** Review bản nháp (đối chiếu slide "Leaky didCancel Boolean Flags").
- **AI Code (bản nháp):**
  ```js
  useEffect(() => {
    fetch(`/api/messages/${forum}`).then((r) => r.json()).then(setData);
  }, [forum]);
  ```
- **Bug:** Bấm #nasa rồi #notNasa liền tay: nếu response #nasa về sau thì danh sách #notNasa bị ghi đè bằng tin #nasa; request cũ vẫn chiếm băng thông.
- **Engineering Fix:** `AbortController` trong effect, cleanup `controller.abort()`, chỉ `setResult` khi `!signal.aborted`; kết quả lưu kèm `forum` nên không bao giờ hiện tin kênh cũ.
  Commit: `feat(ex1.7.1): add useForumMessages hook with AbortController`
- **Verify sau fix:** Đổi kênh nhanh 5 lần → Network hiện 5 request `(canceled)`, chỉ còn tin của kênh cuối.

## Failure #11: Log AbortError ra Console mỗi lần đổi kênh

- **Task:** T12
- **Phát hiện:** Review code mẫu trên slide.
- **AI Code (bản nháp):**
  ```js
  .catch((err) => console.error(err));
  ```
- **Bug:** Mỗi lần đổi kênh Console in `AbortError: signal is aborted without reason` → vi phạm Console sạch, dù đây là hành vi đúng.
- **Engineering Fix:** Trong `catch`, kiểm tra `controller.signal.aborted` trước — bị huỷ thì bỏ qua hoàn toàn; lỗi thật mới đưa vào state và hiện `role="alert"`.
- **Verify sau fix:** Đổi kênh liên tục → Console trống.

## Failure #12: Server tin toàn bộ `req.body` (mass assignment)

- **Task:** T11
- **Phát hiện:** Review code contract `server.js` trên slide.
- **AI Code (theo slide):**
  ```js
  const newMessage = { id: crypto.randomUUID(), ...req.body, timestamp: new Date() };
  ```
- **Bug:** Gửi `{"author":"a","text":"b","timestamp":"2000-01-01","forum":"nasa"}` → client ghi đè được `timestamp`/`forum`; chuỗi toàn khoảng trắng vẫn qua được kiểm tra `!req.body.text`; body không giới hạn kích thước.
- **Engineering Fix:** `validateMessage` trim và chỉ trả về `{ author, text }`; spread `value` TRƯỚC `timestamp`; `express.json({ limit: '10kb' })`; middleware lỗi trả JSON 400/413.
  Commit: `feat(ex1.7.1): add Express REST API with CORS and payload validation`
- **Verify sau fix:** `curl -X POST ... -d '{"author":"  ","text":"x","id":"hack"}'` → `400 { "fields": { "author": "Vui lòng nhập tên hiển thị." } }`.

## Failure #13: `cors()` mở cho mọi origin

- **Task:** T11
- **Phát hiện:** Review bản nháp.
- **AI Code (bản nháp):**
  ```js
  app.use(cors());
  ```
- **Bug:** `Access-Control-Allow-Origin: *` → bất kỳ trang web nào cũng gọi được API.
- **Engineering Fix:** `cors({ origin: CORS_ORIGINS })` với danh sách lấy từ `process.env.CORS_ORIGINS` (mặc định 5173, 4173); ghi vào `.env.example`.
- **Verify sau fix:** Network → response header `Access-Control-Allow-Origin: http://localhost:5173`.

| # | Lỗi | Phát hiện bằng | Commit fix |
|---|-----|----------------|------------|
| 10 | Race khi đổi kênh | Review + Network | `feat(ex1.7.1): add useForumMessages hook with AbortController` |
| 11 | Log AbortError | Review slide + Console | `feat(ex1.7.1): add useForumMessages hook with AbortController` |
| 12 | Mass assignment | Review slide + curl | `feat(ex1.7.1): add Express REST API with CORS and payload validation` |
| 13 | CORS mở toàn bộ | Review + response header | `feat(ex1.7.1): add Express REST API with CORS and payload validation` |