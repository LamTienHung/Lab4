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