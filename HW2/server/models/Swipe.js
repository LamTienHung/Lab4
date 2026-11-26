import mongoose from 'mongoose';

export const SWIPE_TYPES = ['LIKE', 'NOPE', 'SUPER'];

const swipeSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',          // liên kết tới collection profiles
      required: [true, 'Thiếu profileId'],
    },
    type: {
      type: String,
      enum: {
        values: SWIPE_TYPES,
        message: 'type phải là LIKE, NOPE hoặc SUPER',
      },
      required: true,
    },
    sessionId: {
      type: String,            // phân biệt từng lượt chơi (từng trình duyệt)
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Swipe', swipeSchema);