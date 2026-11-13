import { useId } from 'react';
import { useFormContext } from './FormContext.js';
import styles from '../App.module.css';

export function InputField({ name, label, type = 'text', hint, children, ...rest }) {
  const { values, errors, setField, markTouched } = useFormContext();
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const error = errors[name];
  const isCheckbox = type === 'checkbox';
  const isSelect = type === 'select';

  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    onBlur: () => markTouched(name),
    ...rest,
  };

  let control;
  if (isSelect) {
    control = (
      <select
        {...common}
        className={styles.input}
        value={values[name]}
        onChange={(e) => setField(name, e.target.value)}
      >
        {children}
      </select>
    );
  } else if (isCheckbox) {
    control = (
      <input
        {...common}
        type="checkbox"
        className={styles.checkbox}
        checked={values[name]}
        onChange={(e) => setField(name, e.target.checked)}
      />
    );
  } else {
    control = (
      <input
        {...common}
        type={type}
        className={styles.input}
        value={values[name]}
        onChange={(e) => setField(name, e.target.value)}
      />
    );
  }

  return (
    <p className={isCheckbox ? `${styles.field} ${styles.fieldInline}` : styles.field}>
      {isCheckbox ? (
        <>
          {control}
          <label htmlFor={id}>{label}</label>
        </>
      ) : (
        <>
          <label htmlFor={id}>{label}</label>
          {control}
        </>
      )}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </p>
  );
}