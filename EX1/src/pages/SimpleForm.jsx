import { useState } from 'react';
import { FormContext } from '../form/FormContext.js';
import { InputField } from '../form/InputField.jsx';
import { ShowData } from '../form/ShowData.jsx';
import { INITIAL_VALUES, ROLES, validateForm } from '../form/validation.js';
import styles from '../App.module.css';

const FIELD_ORDER = Object.keys(INITIAL_VALUES);

export default function SimpleForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  // Derived state: tính đồng bộ ngay trong render → 1 lần render / 1 phím
  const allErrors = validateForm(values);
  const errorCount = Object.keys(allErrors).length;
  const isValid = errorCount === 0;

  // Chỉ hiện lỗi của field đã rời khỏi (blur) hoặc sau khi bấm Gửi
  const visibleErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([name]) => submitAttempted || touched[name]),
  );

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const markTouched = (name) => setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid) {
      const firstInvalid = FIELD_ORDER.find((name) => allErrors[name]);
      e.currentTarget.elements.namedItem(firstInvalid)?.focus(); // đưa focus tới lỗi đầu tiên — trong event handler
      setSubmitted(null);
      return;
    }
    setSubmitted({
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      age: Number(values.age),
      role: ROLES.find((r) => r.value === values.role)?.label ?? values.role,
    });
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setSubmitAttempted(false);
    setSubmitted(null);
  };

  return (
    <section aria-labelledby="form-title" className={`${styles.card} ${styles.formBox}`}>
      <title>Biểu mẫu · S3T Directory</title>
      <h1 id="form-title" className={styles.pageTitle}>
        Đăng ký thành viên
      </h1>
      <p className={styles.muted}>Lỗi được tính đồng bộ trong lúc render — không có useEffect nào.</p>

      <FormContext.Provider value={{ values, errors: visibleErrors, setField, markTouched }}>
        <form noValidate className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <InputField name="fullName" label="Họ tên" autoComplete="name" />
          <InputField name="email" label="Email" type="email" autoComplete="email" />
          <InputField name="age" label="Tuổi" type="number" inputMode="numeric" min={16} max={99} hint="Từ 16 đến 99." />
          <InputField name="role" label="Vai trò" type="select">
            <option value="">— Chọn vai trò —</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </InputField>
          <InputField
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete="new-password"
            hint="Ít nhất 8 ký tự, có cả chữ và số."
          />
          <InputField name="confirmPassword" label="Nhập lại mật khẩu" type="password" autoComplete="new-password" />
          <InputField name="agree" label="Tôi đồng ý với điều khoản sử dụng" type="checkbox" />

          <output
            role="status"
            aria-live="polite"
            className={styles.summary}
            data-state={submitAttempted && !isValid ? 'error' : 'ok'}
          >
            {submitAttempted && !isValid ? `Còn ${errorCount} lỗi cần sửa.` : isValid ? 'Biểu mẫu hợp lệ.' : ''}
          </output>

          <p className={styles.actions}>
            <button type="submit" className={styles.button}>
              Gửi
            </button>
            <button type="reset" className={`${styles.button} ${styles.secondary}`}>
              Nhập lại
            </button>
          </p>
        </form>
      </FormContext.Provider>

      {submitted && (
        <section aria-labelledby="inspector-title" className={styles.inspector}>
          <h2 id="inspector-title" className={styles.cardTitle}>
            Dữ liệu đã gửi
          </h2>
          <ShowData data={submitted} />
        </section>
      )}
    </section>
  );
}