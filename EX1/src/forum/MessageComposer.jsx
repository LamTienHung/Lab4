import { useId, useState } from 'react';
import { MESSAGE_LIMITS, validateMessage } from '../../shared/validateMessage.js';
import styles from '../App.module.css';

export function MessageComposer({ channelLabel, onPost }) {
  const authorId = useId();
  const textId = useId();
  const [draft, setDraft] = useState({ author: '', text: '' });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Cùng hàm validate với server → lỗi hiển thị trước khi gửi
  const { errors, value } = validateMessage(draft);
  const shown = submitAttempted ? errors : {};

  const update = (field) => (e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setServerError(null);
    if (Object.keys(errors).length > 0) {
      e.currentTarget.elements.namedItem(errors.author ? 'author' : 'text')?.focus();
      return;
    }
    setSending(true);
    try {
      await onPost(value);
      setDraft((prev) => ({ ...prev, text: '' })); // giữ tên, xoá nội dung
      setSubmitAttempted(false);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form noValidate className={styles.composer} onSubmit={handleSubmit} aria-label={`Gửi tin vào ${channelLabel}`}>
      <p className={styles.field}>
        <label htmlFor={authorId}>Tên hiển thị</label>
        <input
          id={authorId}
          name="author"
          className={styles.input}
          maxLength={MESSAGE_LIMITS.author}
          autoComplete="nickname"
          value={draft.author}
          aria-invalid={Boolean(shown.author)}
          aria-describedby={shown.author ? `${authorId}-error` : undefined}
          onChange={update('author')}
        />
        {shown.author && (
          <span id={`${authorId}-error`} className={styles.error}>
            {shown.author}
          </span>
        )}
      </p>
      <p className={styles.field}>
        <label htmlFor={textId}>Nội dung</label>
        <textarea
          id={textId}
          name="text"
          rows={3}
          className={`${styles.input} ${styles.textarea}`}
          maxLength={MESSAGE_LIMITS.text}
          value={draft.text}
          aria-invalid={Boolean(shown.text)}
          aria-describedby={`${textId}-count${shown.text ? ` ${textId}-error` : ''}`}
          onChange={update('text')}
        />
        <span id={`${textId}-count`} className={styles.hint}>
          {draft.text.length}/{MESSAGE_LIMITS.text}
        </span>
        {shown.text && (
          <span id={`${textId}-error`} className={styles.error}>
            {shown.text}
          </span>
        )}
      </p>
      <output role="status" aria-live="polite" className={`${styles.summary} ${serverError ? styles.error : ''}`}>
        {serverError ? `Gửi thất bại: ${serverError}` : sending ? 'Đang gửi…' : ''}
      </output>
      <p className={styles.actions}>
        <button type="submit" className={styles.button} disabled={sending} aria-busy={sending}>
          {sending ? 'Đang gửi…' : 'Gửi tin'}
        </button>
      </p>
    </form>
  );
}