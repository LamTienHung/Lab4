import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import { validateMessage } from '../shared/validateMessage.js';
import { addMessage, getMessagesByForum, hasForum } from './store.js';

const PORT = Number(process.env.PORT ?? 3001);
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = express();
app.use(cors({ origin: CORS_ORIGINS }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/messages/:forum', async (req, res) => {
  const { forum } = req.params;
  if (!hasForum(forum)) return res.status(404).json({ error: `Không có kênh "${forum}".` });
  await sleep(300 + Math.random() * 900); // mô phỏng độ trễ mạng để thấy request bị huỷ
  res.json(await getMessagesByForum(forum));
});

app.post('/api/messages/:forum', async (req, res) => {
  const { forum } = req.params;
  if (!hasForum(forum)) return res.status(404).json({ error: `Không có kênh "${forum}".` });

  const { errors, value } = validateMessage(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ.', fields: errors });
  }

  const message = { id: randomUUID(), forum, ...value, timestamp: new Date().toISOString() };
  await addMessage(forum, message);
  res.status(201).json(message);
});

app.use((req, res) => res.status(404).json({ error: 'Không tìm thấy endpoint.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON không hợp lệ.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Payload quá lớn.' });
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ.' });
});

app.listen(PORT, () => {
  console.log(`API chạy tại http://localhost:${PORT} — CORS cho: ${CORS_ORIGINS.join(', ')}`);
});