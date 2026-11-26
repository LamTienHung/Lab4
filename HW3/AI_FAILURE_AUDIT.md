# AI Failure Audit — HW3 Esports Fair-Play Appeal Tribunal

> "Generate with AI. Verify with Engineering."
> Post-mortem phân tích kiến trúc: các chỗ code mẫu (slide 33) và code AI sinh ra bị sai / thiếu, nguyên nhân gốc, cách sửa và cách phòng tránh.

## 1. Tóm tắt điều hành
| Hạng mục | Số lỗi | Ghi chú |
|---|---|---|
| Routing | 3 | Hard-code route, thiếu 404, phân biệt hoa thường |
| Timer / Side-effect | 4 | Trôi thời gian, rò rỉ listener, hàm không tồn tại |
| State / Rules of Hooks | 4 | Hook sau `return`, lỗi lưu thừa trong state, form không reset |
| Accessibility | 2 | Screen reader bị đọc mỗi giây, không chuyển focus khi lỗi |
| Tính toán | 1 | Chia cho 0 |
| Đạo đức dữ liệu | 1 | AI sinh cáo buộc nghiêm trọng gắn tên người thật |
| **Tổng** | **15** | Đều đã sửa |

## 2. Bảng tổng hợp
| # | Lỗi | Mức độ | Phát hiện bằng | Trạng thái |
|---|---|---|---|---|
| F1 | Hard-code `/dossier/himass`, `/dossier/tanvuu` | Cao | Đọc slide 33 | Đã sửa |
| F2 | `resyncTimerWithServer()` không tồn tại, HW3 không có server | Cao | `ReferenceError` | Đã sửa |
| F3 | `addEventListener` không có cleanup → rò rỉ listener | Cao | React DevTools / StrictMode | Đã sửa |
| F4 | Đếm lùi `remaining - 1` bằng `setInterval` → trôi | Cao | Ẩn tab, so với đồng hồ hệ thống | Đã sửa |
| F5 | Hook gọi sau `return` 404 → crash khi đổi route | Cao | Console: *Rendered more hooks* | Đã sửa |
| F6 | `errors` lưu trong `useState` + `useEffect` đồng bộ | Trung bình | Lỗi hiển thị trễ 1 nhịp | Đã sửa |
| F7 | Form giữ dữ liệu khi đổi từ TanVuu sang Himass | Trung bình | Test chuyển hồ sơ | Đã sửa |
| F8 | Bấm Nộp 2 lần → gửi 2 đơn | Trung bình | Double-click | Đã sửa |
| F9 | Hết SLA vẫn nộp được (đồng hồ và form dùng 2 timer riêng) | Trung bình | Chỉnh deadline về quá khứ | Đã sửa |
| F10 | ID không tồn tại → `Cannot read properties of null` | Trung bình | `/dossier/abc` | Đã sửa |
| F11 | `aria-live` trên đồng hồ → đọc mỗi giây | Trung bình | NVDA | Đã sửa |
| F12 | Nộp lỗi không đưa focus tới ô sai | Trung bình | Test bàn phím | Đã sửa |
| F13 | Chia cho 0 khi tiền lệ = 0 → `Infinity` / `NaN` | Thấp | Vi phạm mức 1 | Đã sửa |
| F14 | `/dossier/Himass` không khớp `himass` | Thấp | Gõ URL hoa | Đã sửa |
| F15 | AI sinh cáo buộc "dùng hack" gắn tên người thật | Cao (đạo đức) | Review nội dung | Đã sửa |

---

## 3. Phân tích chi tiết

### F1 — Route hard-code
**Code slide 33:**
```jsx
<Route path="/dossier/himass" element={<DossierView user="Himass" />} />
<Route path="/dossier/tanvuu" element={<DossierView user="TanVuu" />} />
```
**Vấn đề:** Trái với yêu cầu đề "dynamic player case routing via `/dossier/:playerID`". Thêm tuyển thủ phải sửa code routing.
**Sửa:** một route động, đọc tham số bằng `useParams`:
```jsx
{ path: 'dossier/:playerID', element: <DossierView /> }
const { playerID } = useParams();
```

### F2 — Hàm không tồn tại
**Code slide 33:**
```js
if (document.visibilityState === 'visible') resyncTimerWithServer();
```
**Vấn đề:** Hàm không được định nghĩa ở đâu → `ReferenceError` khi quay lại tab. HW3 chỉ có frontend, không có server để đồng bộ.
**Sửa:** đồng bộ theo đồng hồ hệ thống: huỷ tick đang chờ và gọi lại `schedule()` để tính `deadline - Date.now()` ngay.

### F3 — Rò rỉ event listener
**Code slide 33:**
```js
document.addEventListener('visibilitychange', () => { ... });
```
**Vấn đề:** Hàm ẩn danh, không có cleanup → mỗi lần mount (StrictMode mount 2 lần, đổi hồ sơ mount lại) thêm 1 listener, không bao giờ gỡ.
**Sửa:** đặt trong `useEffect`, dùng hàm có tên và gỡ trong cleanup:
```js
document.addEventListener('visibilitychange', handleVisibility);
return () => document.removeEventListener('visibilitychange', handleVisibility);
```

### F4 — Đồng hồ bị trôi
**Code AI thường sinh:**
```js
setInterval(() => setRemaining((r) => r - 1000), 1000);
```
**Vấn đề:** `setInterval` không đảm bảo đúng 1000ms; tab ẩn bị throttle tới 1 lần/phút → sai lệch hàng phút.
**Sửa:** "zero-drift": luôn tính `remaining = deadline - Date.now()`, tick căn đầu giây bằng `setTimeout(schedule, 1000 - now % 1000)`.
**Kiểm chứng:** ẩn tab 1 phút, quay lại → đồng hồ khớp ngay.

### F5 — Vi phạm Rules of Hooks
**Code AI:**
```jsx
const dossier = findDossier(playerID);
if (!dossier) return <NotFound />;
const timer = useAppealSlaTimer(dossier.appealDeadline); // hook sau return
```
**Vấn đề:** Đi từ `/dossier/abc` sang `/dossier/himass` → số hook giữa 2 lần render khác nhau → *Rendered more hooks than during the previous render*.
**Sửa:** gọi mọi hook trước, dùng optional chaining: `useAppealSlaTimer(dossier?.appealDeadline)`.

### F6 — Lỗi form lưu trong state
**Code AI:**
```js
const [errors, setErrors] = useState({});
useEffect(() => setErrors(validate(values)), [values]);
```
**Vấn đề:** Render 2 lần mỗi phím gõ; ở render đầu `errors` còn là giá trị cũ → nút Nộp có thể bấm được với dữ liệu sai.
**Sửa:** derived state: `const errors = useMemo(() => validate(values, { isExpired }), [values, isExpired]);`

### F7 — Form không reset khi đổi hồ sơ
**Vấn đề:** React giữ nguyên instance Provider khi chỉ đổi `:playerID` → đơn của TanVuu xuất hiện trong trang Himass.
**Sửa:** `<AppealFormProvider key={dossier.id} ...>` → đổi hồ sơ là tạo form mới.

### F8 — Nộp trùng
**Sửa:** `submit()` thoát nếu `status !== 'idle'`; nút có `disabled` và `aria-busy` khi đang gửi.

### F9 — Hai nguồn thời gian
**Code AI:** `SlaCountdown` và `AppealForm` mỗi nơi tự gọi `useAppealSlaTimer`.
**Vấn đề:** Hai timer tick lệch nhau vài ms → có khoảnh khắc đồng hồ báo hết hạn nhưng form vẫn cho nộp.
**Sửa:** gọi hook **một lần** ở `DossierView`, truyền `timer` xuống đồng hồ và `isExpired` xuống Provider.

### F10 — Thiếu 404 boundary
**Sửa:** `findDossier()` trả `null` → render `NotFound` với thông báo riêng và link tới các hồ sơ có thật.

### F11 — Screen reader bị spam
**Code AI:** `<p aria-live="polite">{hh}:{mm}:{ss}</p>`
**Vấn đề:** NVDA đọc thời gian **mỗi giây**, người dùng không nghe được nội dung khác.
**Sửa:** đồng hồ dùng `role="timer"` (mặc định không tự đọc) + `aria-label`; chỉ dòng **trạng thái** (bình thường → khẩn → hết hạn) có `aria-live`.

### F12 — Không quản lý focus khi lỗi
**Sửa:** `noValidate` để dùng validate tiếng Việt thống nhất; nộp lỗi → banner "Còn N mục chưa hợp lệ" + focus ô lỗi đầu tiên (WCAG 3.3.1).

### F13 — Chia cho 0
**Vấn đề:** Vi phạm mức 1 có tiền lệ 0 trận → `actual / 0 = Infinity`, `0 / 0 = NaN` hiện lên bảng.
**Sửa:** `ratio = expected === 0 ? (actual === 0 ? 1 : null) : actual / expected;` và hiển thị `null` là "∞".

### F14 — Phân biệt hoa thường
**Sửa:** `DOSSIERS.find((d) => d.id === id?.toLowerCase())`.

### F15 — Rủi ro đạo đức dữ liệu
**Vấn đề:** Khi được yêu cầu "tạo dữ liệu hồ sơ kỷ luật cho Himass và TanVuu", AI có xu hướng sinh cáo buộc nghiêm trọng (hack, bán độ). Đây có thể là tên người thật; repo GitHub là công khai → nguy cơ bôi nhọ.
**Sửa:** chỉ dùng vi phạm hành chính nhẹ, ghi rõ "dữ liệu hư cấu" ở đầu file dữ liệu, footer giao diện và `project-rules.md`.

---

## 4. Phân tích nguyên nhân gốc
| Nguyên nhân | Lỗi liên quan | Mô tả |
|---|---|---|
| **AI sinh code "trông đúng" nhưng không chạy được** | F2 | Gọi hàm giả định tồn tại để code mẫu gọn |
| **Bỏ qua vòng đời component** | F3, F5, F7 | AI viết như script chạy 1 lần, quên mount/unmount/re-render |
| **Lưu trùng dữ liệu** | F6, F9 | Tạo thêm state/timer thay vì suy ra từ một nguồn |
| **Chỉ test "happy path"** | F8, F10, F13, F14 | Không xét input sai, ID sai, thao tác nhanh |
| **Accessibility chỉ ở mức thẻ** | F11, F12 | Có `aria-*` nhưng không kiểm tra trải nghiệm thật với screen reader |
| **Không xét bối cảnh nội dung** | F15 | AI không tự cân nhắc hậu quả với người thật |

## 5. Quy trình kiểm chứng đã dùng
1. Đối chiếu từng dòng code slide 33 với yêu cầu đề (route động, Page Visibility API, derived matrix).
2. `StrictMode` để lộ lỗi effect và listener.
3. Test thủ công: đổi hồ sơ, `/dossier/abc`, nộp rỗng / nộp đủ / double-click, ẩn tab 1 phút.
4. Công cụ: React DevTools, Console, ESLint `jsx-a11y`, axe DevTools, NVDA.

## 6. Bài học & biện pháp phòng tránh
1. **Một nguồn sự thật:** trước khi thêm `useState`, hỏi "giá trị này có tính được từ state khác không?".
2. **Mọi side-effect phải có cleanup** — viết `return () => …` ngay khi viết `addEventListener` / `setTimeout`.
3. **Thời gian = tính từ mốc tuyệt đối**, không bao giờ cộng/trừ dồn.
4. **Hook luôn ở đầu component**, kiểm tra điều kiện sau.
5. **Test đường lỗi trước đường đúng**: ID sai, dữ liệu rỗng, thao tác nhanh, hết hạn.
6. **Kiểm tra nội dung AI sinh ra** khi liên quan người thật, không chỉ kiểm tra code.