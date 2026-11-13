// Hàm thuần: cùng values → cùng errors. Gọi trực tiếp trong render, không cần useEffect.
export const INITIAL_VALUES = {
  fullName: '',
  email: '',
  age: '',
  role: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

export const ROLES = [
  { value: 'frontend', label: 'Frontend Engineer' },
  { value: 'backend', label: 'Backend Engineer' },
  { value: 'designer', label: 'UX Designer' },
  { value: 'qa', label: 'QA Engineer' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateForm(values) {
  const errors = {};
  const name = values.fullName.trim();
  const age = Number(values.age);

  if (!name) errors.fullName = 'Vui lòng nhập họ tên.';
  else if (name.length < 2) errors.fullName = 'Họ tên cần ít nhất 2 ký tự.';

  if (!values.email.trim()) errors.email = 'Vui lòng nhập email.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Email không đúng định dạng (ví dụ: ten@example.com).';

  if (values.age === '') errors.age = 'Vui lòng nhập tuổi.';
  else if (!Number.isInteger(age) || age < 16 || age > 99) errors.age = 'Tuổi phải là số nguyên từ 16 đến 99.';

  if (!values.role) errors.role = 'Vui lòng chọn vai trò.';

  if (values.password.length < 8) errors.password = 'Mật khẩu cần ít nhất 8 ký tự.';
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    errors.password = 'Mật khẩu cần có cả chữ và số.';

  // Validate chéo nhiều field — vẫn đồng bộ, vẫn trong cùng 1 lần render
  if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Mật khẩu nhập lại không khớp.';

  if (!values.agree) errors.agree = 'Bạn cần đồng ý với điều khoản.';

  return errors;
}