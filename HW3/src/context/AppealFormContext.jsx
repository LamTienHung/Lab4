import { createContext, useContext, useMemo, useState } from 'react';

const AppealFormContext = createContext(null);

export const GROUND_OPTIONS = [
  { value: 'disproportionate', label: 'Án phạt không tương xứng với vi phạm' },
  { value: 'procedural', label: 'Sai sót về thủ tục xử lý' },
  { value: 'new-evidence', label: 'Có bằng chứng mới' },
];

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  contestedIds: [], // các vi phạm muốn kháng cáo
  ground: '',
  statement: '',
  agree: false,
};

const STATEMENT_MIN = 50;
const STATEMENT_MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ===== Validate: hàm THUẦN, chạy lại mỗi lần render → lỗi là DERIVED STATE =====
export function validate(values, { isExpired }) {
  const errors = {};
  const name = values.fullName.trim();
  const statement = values.statement.trim();

  if (!name) errors.fullName = 'Vui lòng nhập họ tên.';
  else if (name.length < 3) errors.fullName = 'Họ tên tối thiểu 3 ký tự.';

  if (!values.email.trim()) errors.email = 'Vui lòng nhập email.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Email không đúng định dạng (vd: ten@domain.com).';

  if (values.contestedIds.length === 0) errors.contestedIds = 'Chọn ít nhất 1 vi phạm muốn kháng cáo.';

  if (!values.ground) errors.ground = 'Chọn căn cứ kháng cáo.';

  if (statement.length < STATEMENT_MIN)
    errors.statement = `Trình bày tối thiểu ${STATEMENT_MIN} ký tự (hiện có ${statement.length}).`;
  else if (statement.length > STATEMENT_MAX)
    errors.statement = `Tối đa ${STATEMENT_MAX} ký tự.`;

  if (!values.agree) errors.agree = 'Bạn cần xác nhận thông tin là trung thực.';

  if (isExpired) errors.form = 'Đã hết hạn kháng cáo (SLA 72 giờ). Không thể nộp.';

  return errors;
}

export function AppealFormProvider({ dossier, isExpired, children }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | submitted
  const [receipt, setReceipt] = useState(null);

  // Lỗi tính lại mỗi khi values / hạn chót đổi — không lưu vào state
  const errors = useMemo(() => validate(values, { isExpired }), [values, isExpired]);
  const isValid = Object.keys(errors).length === 0;

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));
  const touchField = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const toggleContested = (id) =>
    setValues((prev) => ({
      ...prev,
      contestedIds: prev.contestedIds.includes(id)
        ? prev.contestedIds.filter((x) => x !== id)
        : [...prev.contestedIds, id],
    }));

  // Chỉ hiện lỗi khi người dùng đã chạm vào ô, hoặc đã bấm Nộp
  const visibleError = (name) => (touched[name] || submitAttempted ? errors[name] : undefined);

  const submit = async () => {
    setSubmitAttempted(true);
    if (!isValid || status !== 'idle') return false;

    setStatus('submitting');
    await new Promise((r) => setTimeout(r, 800)); // mô phỏng gửi lên hệ thống

    setReceipt({
      code: `${dossier.caseNumber}-AP-${Date.now().toString(36).toUpperCase()}`,
      submittedAt: Date.now(),
      contestedIds: values.contestedIds,
    });
    setStatus('submitted');
    return true;
  };

  const value = {
    dossier,
    values,
    errors,
    isValid,
    status,
    receipt,
    submitAttempted,
    isExpired,
    setField,
    touchField,
    toggleContested,
    visibleError,
    submit,
    limits: { STATEMENT_MIN, STATEMENT_MAX },
  };

  return <AppealFormContext.Provider value={value}>{children}</AppealFormContext.Provider>;
}

export function useAppealForm() {
  const ctx = useContext(AppealFormContext);
  if (!ctx) throw new Error('useAppealForm phải dùng bên trong <AppealFormProvider>');
  return ctx;
}