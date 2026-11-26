// ⚠️ DỮ LIỆU MÔ PHỎNG cho bài tập (case study của slide Lab 4).
// Các sự việc, số liệu, án phạt đều HƯ CẤU — không phản ánh sự kiện có thật
// liên quan tới bất kỳ cá nhân nào.

const HOUR = 60 * 60 * 1000;
const APP_START = Date.now(); // mốc khi tải app → countdown luôn có thời gian để demo

// Mức độ vi phạm (1 = nhẹ … 5 = rất nặng) và án phạt "chuẩn" theo tiền lệ
export const SEVERITY_LABELS = {
  1: 'Nhẹ',
  2: 'Trung bình',
  3: 'Đáng kể',
  4: 'Nặng',
  5: 'Rất nặng',
};

// Tiền lệ: mức án thường áp dụng cho từng mức độ (đơn vị: số trận cấm thi đấu)
export const PRECEDENT_BANS = { 1: 0, 2: 1, 3: 3, 4: 6, 5: 12 };

export const DOSSIERS = [
  {
    id: 'himass',
    displayName: 'Himass',
    team: 'Đội mô phỏng A',
    role: 'Tuyển thủ',
    caseNumber: 'FP-2026-041',
    status: 'Đang kháng cáo',
    issuedAt: APP_START - 46 * HOUR,
    appealDeadline: APP_START + 26 * HOUR, // SLA 72 giờ kể từ khi ra quyết định
    summary:
      'Quyết định kỷ luật sau giải đấu mô phỏng. Tuyển thủ cho rằng mức án vượt quá tiền lệ cho các vi phạm cùng mức độ.',
    incidents: [
      { id: 'H1', rule: 'Trễ giờ check-in', severity: 1, banMatches: 1 },
      { id: 'H2', rule: 'Ngôn từ thiếu chuẩn mực trên kênh chat chung', severity: 2, banMatches: 3 },
      { id: 'H3', rule: 'Thiết bị ngoại vi chưa qua kiểm tra', severity: 3, banMatches: 6 },
    ],
  },
  {
    id: 'tanvuu',
    displayName: 'TanVuu',
    team: 'Đội mô phỏng B',
    role: 'Tuyển thủ',
    caseNumber: 'FP-2026-042',
    status: 'Đang kháng cáo',
    issuedAt: APP_START - 70 * HOUR,
    appealDeadline: APP_START + 2 * HOUR, // sắp hết hạn → demo trạng thái khẩn
    summary:
      'Quyết định kỷ luật liên quan tới quy định trang phục và thời gian tạm dừng. Tuyển thủ đề nghị xem xét lại mức án.',
    incidents: [
      { id: 'T1', rule: 'Sai quy định trang phục thi đấu', severity: 1, banMatches: 0 },
      { id: 'T2', rule: 'Tạm dừng trận quá thời gian cho phép', severity: 2, banMatches: 1 },
      { id: 'T3', rule: 'Rời vị trí thi đấu khi chưa được phép', severity: 3, banMatches: 4 },
    ],
  },
];

export const findDossier = (id) =>
  DOSSIERS.find((d) => d.id === id?.toLowerCase()) ?? null;