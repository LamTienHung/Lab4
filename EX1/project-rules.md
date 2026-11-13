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
12. SYNC VALIDATION: Lỗi form tính bằng hàm thuần validateForm(values) ngay trong render.
    Cấm useEffect + setState để validate, kể cả validate chéo nhiều field.
13. FORM CONTEXT: Field đọc values/errors qua useFormContext(); hook ném lỗi nếu thiếu Provider.
14. FIELD A11Y: useId cho label; aria-invalid; aria-describedby nối hint + lỗi.
    Chỉ 1 vùng live (role="status") tóm tắt số lỗi — không gắn role="alert" cho từng field.
15. NO SECRET DUMP: ShowData không hiển thị mật khẩu dạng chữ thường.

16. FETCH HOOK: Mọi fetch trong useEffect dùng AbortController; cleanup gọi abort();
    chỉ setState khi !signal.aborted; AbortError không được log ra Console.
17. NO STALE CHANNEL: Kết quả gắn với đúng tham số đã gửi (forum, version); loading là derived state.
18. VALIDATION PARITY: Client và server dùng chung shared/validateMessage.js.
19. EXPRESS HYGIENE: cors() chỉ cho origin cụ thể; express.json có limit; POST chỉ nhận field cho phép,
    id sinh bằng crypto.randomUUID(); lỗi trả JSON có mã 400/404/413/500.
20. NO SECRETS: Cấu hình qua process.env / import.meta.env; commit .env.example, không commit .env. 