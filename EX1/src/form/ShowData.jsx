import { Fragment } from 'react';
import styles from '../App.module.css';

const LABELS = {
  fullName: 'Họ tên',
  email: 'Email',
  age: 'Tuổi',
  role: 'Vai trò',
  password: 'Mật khẩu',
  confirmPassword: 'Nhập lại mật khẩu',
  agree: 'Đồng ý điều khoản',
};

const SECRET = new Set(['password', 'confirmPassword']);

function display(key, value) {
  if (SECRET.has(key)) return '•'.repeat(String(value).length); // không lộ mật khẩu ra UI
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  return String(value);
}

export function ShowData({ data }) {
  return (
    <dl className={styles.details}>
      {Object.entries(data).map(([key, value]) => (
        <Fragment key={key}>
          <dt>{LABELS[key] ?? key}</dt>
          <dd>{display(key, value)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}