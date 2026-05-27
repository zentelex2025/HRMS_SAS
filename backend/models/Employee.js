import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,
  college: String,
  university: String,
  percentage: String,
  marksheet: String, // file path
});

const experienceSchema = new mongoose.Schema({
  companyName: String,
  companyAddress: String,
  designation: String,
  startDate: String,
  endDate: String,
  jobRole: String,
  reportingManager: String,
  contactNumber: String,
  reasonForLeaving: String,
  employeeId: String,
  expCertificate: String, // file path
});

const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },

    // PERSONAL INFO
    employeeId: { type: String, unique: true },

    name: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: String },
    address: { type: String },
    department: { type: String },
    designation: { type: String },
    joinDate: { type: String },
    emergencyContact: { type: String },

    // NEW FIELDS
    bloodGroup: { type: String },
    maritalStatus: { type: String },
    religion: { type: String },
    languageKnown: { type: [String] },

    // PHOTO & DOCUMENTS
    photo: { type: String }, // file path
    govId: { type: String }, // file path

    // EDUCATION (max 4)
    education: [educationSchema],

    // EXPERIENCE (multiple)
    experience: [experienceSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Employee", employeeSchema);
