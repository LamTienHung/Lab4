import { useRef } from 'react';
import { useAppealForm, GROUND_OPTIONS } from '../context/AppealFormContext.jsx';
import FormField from './FormField.jsx';

const FIELD_ORDER = ['fullName', 'email', 'contestedIds', 'ground', 'statement', 'agree'];

export default function AppealForm({ matrixRows }) {
  const {
    dossier, values, errors, status, receipt, isExpired, submitAttempted,
    setField, touchField, toggleContested, visibleError, submit, limits,
  } = useAppealForm();
  const formRef = useRef(null);

  // ===== Đã nộp thành công → hiện biên nhận =====
  if (status === 'submitted' && receipt) {
    return (
      <section className="receipt" aria-labelledby="receipt-title" tabIndex={-1} ref={(el) => el?.focus()}>
        <h3 id="receipt-title">✔ Đã nộp đơn kháng cáo</h3>
        <dl>
          <dt>Mã biên nhận</dt><dd><code>{receipt.code}</code></dd>
          <dt>Thời điểm nộp</dt><dd>{new Date(receipt.submittedAt).toLocaleString('vi-VN')}</dd>
          <dt>Vi phạm kháng cáo</dt><dd>{receipt.contestedIds.join(', ')}</dd>
        </dl>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit();
    if (!ok) {
      // Đưa focus tới ô lỗi đầu tiên (WCAG 3.3.1)
      const first = FIELD_ORDER.find((f) => errors[f]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    }
  };

  const contestedError = visibleError('contestedIds');
  const agreeError = visibleError('agree');
  const statementLength = values.statement.trim().length;
  const errorCount = Object.keys(errors).filter((k) => k !== 'form').length;
  const disabled = status !== 'idle';

  return (
    <form ref={formRef} className="appeal-form" onSubmit={handleSubmit} noValidate aria-labelledby="appeal-title">
      <h3 id="appeal-title">Đơn kháng cáo — {dossier.displayName}</h3>

      {isExpired && (
        <p className="form-banner is-error" role="alert">{errors.form}</p>
      )}

      {submitAttempted && errorCount > 0 && (
        <p className="form-banner is-error" role="alert">
          Còn {errorCount} mục chưa hợp lệ. Vui lòng kiểm tra các ô được đánh dấu ⚠.
        </p>
      )}

      <FormField name="fullName" label="Họ và tên" autoComplete="name" />
      <FormField name="email" label="Email liên hệ" type="email" autoComplete="email" hint="Kết quả kháng cáo sẽ gửi về email này." />

      {/* ===== Chọn vi phạm muốn kháng cáo ===== */}
      <fieldset
        className={contestedError ? 'field fieldset has-error' : 'field fieldset'}
        aria-describedby={contestedError ? 'contested-error' : undefined}
      >
        <legend className="field-label">
          Vi phạm muốn kháng cáo <span className="required" aria-hidden="true">*</span>
        </legend>
        {matrixRows.map((row) => (
          <label key={row.id} className="check-row">
            <input
              type="checkbox"
              name="contestedIds"
              checked={values.contestedIds.includes(row.id)}
              onChange={() => toggleContested(row.id)}
              onBlur={() => touchField('contestedIds')}
              disabled={disabled}
            />
            <span>
              <strong>{row.id}</strong> — {row.rule}
              {row.verdict === 'excessive' && (
                <span className="badge badge-excessive"> nặng hơn tiền lệ +{row.delta}</span>
              )}
            </span>
          </label>
        ))}
        {contestedError && (
          <p id="contested-error" className="field-error" role="alert">
            <span aria-hidden="true">⚠ </span>{contestedError}
          </p>
        )}
      </fieldset>

      <FormField name="ground" label="Căn cứ kháng cáo" as="select" options={GROUND_OPTIONS} />

      <FormField
        name="statement"
        label="Trình bày lý do"
        as="textarea"
        maxLength={limits.STATEMENT_MAX}
        hint={`${statementLength}/${limits.STATEMENT_MAX} ký tự — tối thiểu ${limits.STATEMENT_MIN}.`}
      />

      {/* ===== Xác nhận ===== */}
      <div className={agreeError ? 'field has-error' : 'field'}>
        <label className="check-row">
          <input
            type="checkbox"
            name="agree"
            checked={values.agree}
            onChange={(e) => setField('agree', e.target.checked)}
            onBlur={() => touchField('agree')}
            aria-invalid={agreeError ? true : undefined}
            aria-describedby={agreeError ? 'agree-error' : undefined}
            disabled={disabled}
          />
          <span>Tôi xác nhận mọi thông tin trên là trung thực.</span>
        </label>
        {agreeError && (
          <p id="agree-error" className="field-error" role="alert">
            <span aria-hidden="true">⚠ </span>{agreeError}
          </p>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={disabled || isExpired} aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Đang gửi…' : 'Nộp đơn kháng cáo'}
      </button>
    </form>
  );
}