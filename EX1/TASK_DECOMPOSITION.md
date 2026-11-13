# TASK_DECOMPOSITION.md — Lab 4 EX1: Multi-Route SPA (Exercise 1.1 → 1.2.2)

> Lab 4 · React 19 + Vite + React Router v7 · Project riêng: `EX1/`
> Quy trình: **Contract → Implement → Verify → Atomic Commit**

## 0. Definition of Done

| # | Tiêu chí | Cách kiểm chứng |
|---|----------|-----------------|
| D1 | React Router v7: `<Routes>`, `element`, layout lồng nhau với `<Outlet />`, không có cú pháp v5 | `grep -rn "Switch\|component=\|exact" src/` rỗng; `npm ls react-router` là 7.x |
| D2 | `NavLink` active bằng callback `className`, có `aria-current="page"`; "Trang chủ" không active ở trang khác | Vào /people → chỉ "Danh bạ" sáng |
| D3 | `About`, `PeopleLayout`, `PersonDetail` tách chunk bằng `React.lazy` | `npm run build` ra 3 file JS riêng |
| D4 | Fallback `<Suspense>` là skeleton cùng kích thước, `aria-busy` + `aria-live` | Slow 3G trên bản preview → skeleton, nội dung hiện ra không nhảy layout |
| D5 | `/people/:id` đọc `useParams()`, `find()`, id sai → 404 `role="alert"` | Mở /people/xyz |
| D6 | Chi tiết hiển thị bằng `<dl>/<dt>/<dd>` | Elements |
| D7 | Deep link: mở thẳng hoặc tải lại /people/p03 vẫn đúng hồ sơ | F5 tại /people/p03 |
| D8 | Grid `minmax(280px, 1fr) 2fr`, 1 cột ở ≤ 720px, 375px không cuộn ngang | DevTools iPhone SE |
| D9 | Zero `<div>` trong component, 1 `<main>`, mỗi trang 1 `<title>`, Console sạch | Elements, Console |

## 1. WBS

```
EX1
├── T0  Init project + rules     (package.json, vite.config.js, index.html, project-rules.md, src/main.jsx, src/index.css)
├── T1  People data              (src/data/people.js)
├── T2  Router layout + lazy     (src/App.jsx, src/components/Layout.jsx, src/components/Skeleton.jsx,
│                                 src/pages/Home.jsx, About.jsx, PeopleLayout.jsx, PeopleIndex.jsx, NotFound.jsx)
├── T3  Detail route handling    (src/pages/PersonDetail.jsx)
├── T4  Styling                  (src/App.module.css)
└── T5  Docs                     (TASK_DECOMPOSITION.md, AI_FAILURE_AUDIT.md)
```

## 2. Chi tiết task

### T0 — Init project
- `npm install react-router@7` (bản mới nhất là v8, đề yêu cầu v7).
- `BrowserRouter` bọc `App` trong `main.jsx`.
- **Commit:** `chore(ex1): init react19 vite project with react-router v7`

### T1 — People data
- **Contract:** `PEOPLE: { id; name; role; team; location; email; joined }[]` — id dạng chuỗi để so sánh trực tiếp với `useParams()`.
- **Commit:** `feat(ex1): add sample people data`

### T2 — Router layout + lazy
- **Contract:**
  ```
  /            Layout (header + nav + <main><Outlet/></main>)
  ├─ index     Home
  ├─ about     About            (lazy, fallback page)
  ├─ people    PeopleLayout     (lazy, fallback directory) — sidebar NavLink + <Outlet/>
  │  ├─ index  PeopleIndex
  │  └─ :id    PersonDetail     (lazy, fallback detail)
  └─ *         NotFound
  ```
- **Ràng buộc:** NavLink "/" có `end`; trang lazy là default export; skeleton dùng chung class kích thước với nội dung thật; PeopleLayout không lồng thêm `<main>`.
- **Verify:** D1–D4.
- **Commit:** `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback`

### T3 — Detail route handling
- **Contract:** `PersonDetail({ people })` → `useParams().id` → `people.find()` → 404 hoặc `<article><dl>`.
- **Ràng buộc:** kiểm tra 404 trước khi đọc thuộc tính; ngày định dạng bằng `Intl.DateTimeFormat('vi-VN')`.
- **Verify:** D5–D7.
- **Commit:** `feat(ex1): add detail route handling with 404 guard`

### T4 — Styling
- **Ràng buộc:** custom properties; grid master-detail; target ≥ 44px; focus-visible; skip link; reduced-motion.
- **Verify:** D8.
- **Commit:** `style(ex1): add responsive master-detail grid at 375px`

### T5 — Docs
- **Commit:** `docs(ex1): add task decomposition and AI failure audit`

## 3. Task → Commit

| Task | Commit |
|------|--------|
| T0 | `chore(ex1): init react19 vite project with react-router v7` |
| T1 | `feat(ex1): add sample people data` |
| T2 | `feat(ex1): add React Router v7 layout with lazy routes and skeleton fallback` |
| T3 | `feat(ex1): add detail route handling with 404 guard` |
| T4 | `style(ex1): add responsive master-detail grid at 375px` |
| T5 | `docs(ex1): add task decomposition and AI failure audit` |

---

# Phần 2 — Exercise 1.3: Context Form Engine & `<ShowData />` Inspector

## Definition of Done

| # | Tiêu chí | Cách kiểm chứng |
|---|----------|-----------------|
| F1 | Lỗi tính đồng bộ trong render, zero `useEffect` trong form | `grep -rn "useEffect" src/form src/pages/SimpleForm.jsx` rỗng |
| F2 | 1 lần render / 1 phím gõ | React Profiler: gõ 1 ký tự → 1 commit |
| F3 | Field lấy dữ liệu qua `FormContext` | `InputField` không nhận `value`/`onChange` qua props |
| F4 | `useId` + `aria-invalid` + `aria-describedby` | Elements: input lỗi có `aria-invalid="true"`, trỏ tới span lỗi |
| F5 | Validate chéo: "Nhập lại mật khẩu" phải khớp | Nhập khác nhau → lỗi "không khớp" |
| F6 | Gửi form lỗi → focus vào field lỗi đầu tiên, tóm tắt "Còn N lỗi" | Bấm Gửi khi form trống |
| F7 | Gửi hợp lệ → `<ShowData />` dạng `<dl>`, mật khẩu bị che | Gửi form đúng |
| F8 | Zero `<div>`, 375px không cuộn ngang, Console sạch | DevTools |

## Task

| Task | File | Commit |
|------|------|--------|
| T6 Form context + validation | `src/form/FormContext.js`, `src/form/validation.js` | `feat(ex1.3): add form context and synchronous validation` |
| T7 InputField | `src/form/InputField.jsx` | `feat(ex1.3): add InputField with useId and aria error binding` |
| T8 SimpleForm + ShowData + route | `src/form/ShowData.jsx`, `src/pages/SimpleForm.jsx`, `src/App.jsx`, `src/components/Layout.jsx`, `src/components/Skeleton.jsx` | `feat(ex1.3): add SimpleForm route with ShowData inspector` |
| T9 Styling | `src/App.module.css`, `src/index.css` | `style(ex1.3): style form fields and error states` |
| T10 Docs | `project-rules.md`, `TASK_DECOMPOSITION.md`, `AI_FAILURE_AUDIT.md` | `docs(ex1.3): update rules, decomposition and AI failure audit` |

**Contract:**
```ts
validateForm(values: FormValues): Partial<Record<keyof FormValues, string>>; // hàm thuần
FormContext value: { values; errors /* chỉ lỗi đang hiển thị */; setField(name, value); markTouched(name) }
<InputField name label type? hint? {...inputProps} />   // type: text | email | number | password | select | checkbox
<ShowData data={Record<string, unknown>} />
```


---

# Phần 3 — Exercise 1.7.1: Full-Stack `useForumMessages` & Express REST API

## Definition of Done

| # | Tiêu chí | Cách kiểm chứng |
|---|----------|-----------------|
| R1 | Đổi kênh nhanh → request cũ bị huỷ | Network (Slow 4G): các request cũ hiện `(canceled)` |
| R2 | Không bao giờ hiện tin của kênh cũ sau khi đổi | Đổi nhanh 5 lần → chỉ thấy tin của kênh cuối |
| R3 | Console sạch khi huỷ request | Không có `AbortError` / `Uncaught (in promise)` |
| R4 | Tin nhắn hiển thị bằng `<dl>` + `<Fragment key>` | Elements |
| R5 | GET `/api/messages/:forum`, POST tạo tin `201`, id bằng `randomUUID()` | Gửi tin → hiện cuối danh sách |
| R6 | POST sai → `400` kèm `fields`; kênh sai → `404`; JSON hỏng → `400` | curl / Network |
| R7 | CORS chỉ cho `localhost:5173` và `4173` | Response header `Access-Control-Allow-Origin` |
| R8 | Server tắt → `role="alert"` + nút Thử lại | Tắt terminal server rồi tải lại |
| R9 | Client và server dùng chung `shared/validateMessage.js` | Gửi form trống → lỗi hiện trước khi gọi API |

## Task

| Task | File | Commit |
|------|------|--------|
| T11 Shared validation + Express API | `shared/validateMessage.js`, `server/package.json`, `server/package-lock.json`, `server/index.js`, `server/store.js`, `.env.example` | `feat(ex1.7.1): add Express REST API with CORS and payload validation` |
| T12 Custom hook | `src/hooks/useForumMessages.js` | `feat(ex1.7.1): add useForumMessages hook with AbortController` |
| T13 Forum UI + route | `src/forum/channels.js`, `src/forum/MessageComposer.jsx`, `src/pages/ForumPage.jsx`, `src/App.jsx`, `src/components/Layout.jsx`, `src/components/Skeleton.jsx` | `feat(ex1.7.1): add forum route with live channel switcher` |
| T14 Styling | `src/App.module.css` | `style(ex1.7.1): style message list and composer` |
| T15 Docs | `project-rules.md`, `TASK_DECOMPOSITION.md`, `AI_FAILURE_AUDIT.md` | `docs(ex1.7.1): update rules, decomposition and AI failure audit` |

**Contract:**
```ts
GET  /api/messages/:forum  → 200 Message[] | 404 { error }
POST /api/messages/:forum  body { author, text } → 201 Message | 400 { error, fields } | 404 { error }
interface Message { id: string; forum: string; author: string; text: string; timestamp: string }

useForumMessages(forum: string) → { data: Message[]; loading: boolean; error: string | null;
                                    refetch(): void; postMessage(payload): Promise<Message> }
```