// Tải 9 ảnh mẫu .webp 800x600 từ picsum.photos vào public/photos
import { mkdir, writeFile } from 'node:fs/promises';

const names = [
  'nature-1', 'nature-2', 'nature-3',
  'city-1', 'city-2', 'city-3',
  'food-1', 'food-2', 'food-3',
];

await mkdir('public/photos', { recursive: true });

for (const name of names) {
  const res = await fetch(`https://picsum.photos/seed/${name}/800/600.webp`);
  if (!res.ok) throw new Error(`Lỗi tải ${name}: ${res.status}`);
  await writeFile(`public/photos/${name}.webp`, Buffer.from(await res.arrayBuffer()));
  console.log('✔', name);
}