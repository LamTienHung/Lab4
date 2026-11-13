// Bộ nhớ tạm trong RAM (Ex 1.7.1). Homework 4 sẽ thay bằng MongoDB + Mongoose 8.
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString();

const seed = {
  nasa: [
    { author: 'Mission Control', text: 'Chào mừng tới kênh #nasa — nơi bàn về tin tức không gian.', ago: 120 },
    { author: 'Orbit Fan', text: 'Có ai xem buổi phóng tên lửa tối qua không?', ago: 45 },
    { author: 'Star Gazer', text: 'Tối nay trời quang, thử ngắm Sao Mộc nhé.', ago: 12 },
  ],
  'esports-tribunal': [
    { author: 'Trọng tài', text: 'Kênh #esports-tribunal: thảo luận các vụ kháng nghị fair-play.', ago: 200 },
    { author: 'Caster', text: 'Hồ sơ kháng nghị mới đã được mở, hạn phản hồi 48 giờ.', ago: 30 },
  ],
  notNasa: [
    { author: 'Flat Moon Society', text: 'Đây KHÔNG phải kênh NASA. Chỉ để test đổi kênh nhanh 🙂', ago: 60 },
  ],
};

const db = new Map(
  Object.entries(seed).map(([forum, list]) => [
    forum,
    list.map(({ ago, ...m }, i) => ({ id: `${forum}-${i + 1}`, forum, ...m, timestamp: minutesAgo(ago) })),
  ]),
);

export const hasForum = (forum) => db.has(forum);

export async function getMessagesByForum(forum) {
  return db.get(forum) ?? [];
}

export async function addMessage(forum, message) {
  db.set(forum, [...db.get(forum), message]);
  return message;
}