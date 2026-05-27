import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: { type: String, required: true }, // format: YYYY-MM-DD
    checkIn: { type: String }, // format: HH:mm:ss
    checkOut: { type: String },
    lateCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Present", "Late Present", "Absent", "Half-Day"],
      default: "Present",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
