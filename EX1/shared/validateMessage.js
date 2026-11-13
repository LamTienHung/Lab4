// Dùng chung cho client và server → validate giống hệt nhau ở 2 phía (validation parity)
export const MESSAGE_LIMITS = { author: 40, text: 500 };

export function validateMessage(payload) {
  const author = typeof payload?.author === 'string' ? payload.author.trim() : '';
  const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
  const errors = {};

  if (!author) errors.author = 'Vui lòng nhập tên hiển thị.';
  else if (author.length > MESSAGE_LIMITS.author) errors.author = `Tên tối đa ${MESSAGE_LIMITS.author} ký tự.`;

  if (!text) errors.text = 'Vui lòng nhập nội dung.';
  else if (text.length > MESSAGE_LIMITS.text) errors.text = `Nội dung tối đa ${MESSAGE_LIMITS.text} ký tự.`;

  // Chỉ trả về đúng 2 field cho phép → client không tự gửi được id/timestamp
  return { errors, value: { author, text } };
}