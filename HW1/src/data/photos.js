// Mỗi ảnh: id (string, vì lấy từ URL ra luôn là string), title, category, src, alt, width, height
// width/height dùng để chống layout shift (CLS) → cần cho Lighthouse 100

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'nature', label: 'Thiên nhiên' },
  { id: 'city', label: 'Thành phố' },
  { id: 'food', label: 'Ẩm thực' },
];

export const PHOTOS = [
  { id: '1', title: 'Ruộng bậc thang Mù Cang Chải', category: 'nature', src: '/photos/nature-1.webp', alt: 'Ruộng bậc thang xanh trải dài trên sườn núi', width: 800, height: 600 },
  { id: '2', title: 'Vịnh Hạ Long', category: 'nature', src: '/photos/nature-2.webp', alt: 'Những đảo đá vôi nhô lên giữa mặt nước xanh ngọc', width: 800, height: 600 },
  { id: '3', title: 'Thác Bản Giốc', category: 'nature', src: '/photos/nature-3.webp', alt: 'Thác nước trắng xóa đổ xuống nhiều tầng giữa rừng cây', width: 800, height: 600 },
  { id: '4', title: 'Phố đi bộ Nguyễn Huệ', category: 'city', src: '/photos/city-1.webp', alt: 'Phố đi bộ rộng lên đèn vào buổi tối, hai bên là nhà cao tầng', width: 800, height: 600 },
  { id: '5', title: 'Cầu Rồng Đà Nẵng', category: 'city', src: '/photos/city-2.webp', alt: 'Cây cầu hình rồng màu vàng bắc qua sông về đêm', width: 800, height: 600 },
  { id: '6', title: 'Phố cổ Hội An', category: 'city', src: '/photos/city-3.webp', alt: 'Dãy nhà tường vàng treo đèn lồng nhiều màu', width: 800, height: 600 },
  { id: '7', title: 'Phở bò', category: 'food', src: '/photos/food-1.webp', alt: 'Tô phở bò với bánh phở, thịt tái và rau thơm', width: 800, height: 600 },
  { id: '8', title: 'Bánh mì', category: 'food', src: '/photos/food-2.webp', alt: 'Ổ bánh mì kẹp thịt, dưa leo và rau ngò', width: 800, height: 600 },
  { id: '9', title: 'Cà phê sữa đá', category: 'food', src: '/photos/food-3.webp', alt: 'Ly cà phê sữa đá đặt cạnh phin nhôm', width: 800, height: 600 },
];