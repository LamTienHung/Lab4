import { useId } from 'react';
import { useAppealForm } from '../context/AppealFormContext.jsx';

/**
 * Ô nhập dùng chung cho form kháng cáo.
 * as: 'input' | 'textarea' | 'select'
 * Tự lấy value / lỗi / handler từ AppealFormContext theo `name`.
 */
export default function FormField({
  name,
  label,
  as = 'input',
  type = 'text',
  hint,
  required = true,
  options = [],
  ...rest
}) {
  const { values, setField, touchField, visibleError, status } = useAppealForm();
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const error = visibleError(name);
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name,
    value: values[name],
    onChange: (e) => setField(name, e.target.value),
    onBlur: () => touchField(name),
    required,
    disabled: status !== 'idle',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: error ? 'field-control has-error' : 'field-control',
    ...rest,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea rows={6} {...common} />;
  } else if (as === 'select') {
    control = (
      <select {...common}>
        <option value="">— Chọn —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  } else {
    control = <input type={type} {...common} />;
  }

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </label>

      {control}

      {hint && <p id={hintId} className="field-hint">{hint}</p>}

      {error && (
        <p id={errorId} className="field-error" role="alert">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}
    </div>
  );
}