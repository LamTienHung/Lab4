import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
      maxlength: 50,
    },
    age: {
      type: Number,
      required: true,
      min: [18, 'Tuổi tối thiểu là 18'],
      max: 99,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 200,
    },
    photo: {
      type: String, // URL ảnh
      required: true,
    },
    tags: {
      type: [String], // ví dụ: ['Cà phê', 'Du lịch']
      default: [],
    },
  },
  { timestamps: true } // tự thêm createdAt, updatedAt
);

export default mongoose.model('Profile', profileSchema);