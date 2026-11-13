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