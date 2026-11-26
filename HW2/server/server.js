import express from 'express';
import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';

// ===== 1. Environment Variable Security Guard =====
const { MONGODB_URI, PORT = 3001, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing – hãy tạo file HW2/.env từ .env.example');

// ===== 2. Modern Connection Syntax (Mongoose 8, không còn flag deprecated) =====
await mongoose.connect(MONGODB_URI);
console.log('✔ Đã kết nối MongoDB');

const app = express();
app.use(express.json({ limit: '10kb' }));

// CORS tối giản (khi client không đi qua proxy của Vite)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ===== 3. GET: danh sách hồ sơ (đọc nhanh bằng .lean()) =====
app.get('/api/profiles', async (req, res) => {
  const profiles = await Profile.find().sort({ createdAt: 1 }).lean();
  res.json(profiles);
});

// ===== 4. GET: lịch sử swipe của 1 phiên (để khôi phục khi F5) =====
app.get('/api/swipes', async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Thiếu sessionId' });

  const swipes = await Swipe.find({ sessionId }).sort({ createdAt: 1 }).lean();
  res.json(swipes);
});

// ===== 5. POST: ghi một lượt swipe =====
app.post('/api/swipe', async (req, res) => {
  try {
    const { profileId, type, sessionId } = req.body; // chỉ lấy đúng 3 trường
    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({ error: 'profileId không hợp lệ' });
    }
    const exists = await Profile.exists({ _id: profileId });
    if (!exists) return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });

    const record = await Swipe.create({ profileId, type, sessionId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message }); // lỗi validate của Mongoose
  }
});

// ===== 6. DELETE: Undo – xoá lượt swipe MỚI NHẤT của phiên (LIFO) =====
app.delete('/api/swipe/last', async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'Thiếu sessionId' });

  const last = await Swipe.findOneAndDelete({ sessionId }, { sort: { createdAt: -1 } });
  if (!last) return res.status(404).json({ error: 'Không còn lượt nào để hoàn tác' });
  res.json(last);
});

// ===== 7. Xử lý lỗi chung & 404 =====
app.use('/api', (req, res) => res.status(404).json({ error: 'API không tồn tại' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ' });
});

app.listen(PORT, () => console.log(`✔ Server chạy tại http://localhost:${PORT}`));