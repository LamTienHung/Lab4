# UIT S3T - LAB 4 AI GOVERNANCE RULES (EX1 Multi-Route SPA)

1. STACK: React 19 + Vite + React Router v7 (cài react-router@7, import từ 'react-router').
2. NO LEGACY APIS: Cấm <Switch>, <Redirect>, component={...}, exact, activeClassName,
   defaultProps, class component, ReactDOM.render.
3. ZERO DIV-SOUP: Dùng <header>, <nav>, <main>, <section>, <article>, <ul>, <li>, <dl>.
   Chỉ có đúng 1 <main> trong trang.
4. NESTED ROUTES: Layout dùng <Outlet />; NavLink dùng callback className({ isActive });
   NavLink tới "/" bắt buộc có prop end.
5. URL PARAMS: useParams() + find(); kiểm tra 404 TRƯỚC khi đọc thuộc tính.
6. CODE SPLITTING: Trang con dùng React.lazy; mỗi <Suspense> có skeleton cùng kích thước
   nội dung thật (CLS = 0), aria-busy="true", aria-live="polite".
7. PAGE TITLE: Mỗi route đặt tiêu đề bằng thẻ <title> của React 19, chỉ 1 <title> mỗi trang.
8. LAYOUT: Master-detail dùng grid minmax(280px, 1fr) 2fr, xếp 1 cột khi ≤ 720px;
   375px không cuộn ngang.
9. CONTRACT-FIRST: Contract → Implement → Verify (DevTools) → Atomic commit.
10. COMPLETE OUTPUT: Luôn xuất đủ vite.config.js, index.html (có favicon).
11. CLI FIRST: Tạo package.json bằng npm init -y + npm pkg set.