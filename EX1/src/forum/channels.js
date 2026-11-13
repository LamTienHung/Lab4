export const CHANNELS = [
  { id: 'nasa', label: '#nasa', description: 'Tin tức không gian' },
  { id: 'esports-tribunal', label: '#esports-tribunal', description: 'Kháng nghị fair-play' },
  { id: 'notNasa', label: '#notNasa', description: 'Kênh thử nghiệm đổi kênh nhanh' },
];

export const CHANNEL_BY_ID = new Map(CHANNELS.map((c) => [c.id, c]));   