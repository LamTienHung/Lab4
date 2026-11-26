import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing');

// Dữ liệu mẫu – nhân vật hư cấu
const profiles = [
  { name: 'Minh Anh', age: 21, bio: 'Thích cà phê muối và podcast lúc 2h sáng.', tags: ['Cà phê', 'Podcast'] },
  { name: 'Quốc Bảo', age: 23, bio: 'Code ban ngày, đánh guitar ban đêm.', tags: ['Âm nhạc', 'Lập trình'] },
  { name: 'Thảo Vy', age: 20, bio: 'Đang tìm người đi ăn ốc cùng.', tags: ['Ẩm thực', 'Sài Gòn'] },
  { name: 'Gia Huy', age: 22, bio: 'Chạy bộ 5km mỗi sáng, nghiện trà đá.', tags: ['Thể thao', 'Trà đá'] },
  { name: 'Ngọc Hân', age: 24, bio: 'Mê phim Ghibli và mèo cam.', tags: ['Phim', 'Mèo'] },
  { name: 'Đức Thịnh', age: 21, bio: 'Leo rank Liên Quân, hứa không toxic.', tags: ['Game', 'Esports'] },
  { name: 'Khánh Linh', age: 22, bio: 'Thích đi phượt Đà Lạt bằng xe máy.', tags: ['Du lịch', 'Phượt'] },
  { name: 'Tuấn Kiệt', age: 25, bio: 'Nấu ăn ngon, rửa bát giỏi hơn.', tags: ['Nấu ăn', 'Hướng nội'] },
].map((p, i) => ({
  ...p,
  photo: `https://picsum.photos/seed/profile-${i + 1}/400/500`,
}));

await mongoose.connect(MONGODB_URI);
console.log('✔ Đã kết nối MongoDB');

await Swipe.deleteMany({});
await Profile.deleteMany({});
const inserted = await Profile.insertMany(profiles);
console.log(`✔ Đã tạo ${inserted.length} hồ sơ mẫu`);

await mongoose.disconnect();
console.log('✔ Xong');