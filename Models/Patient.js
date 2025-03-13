const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 }, // Prevents negative age
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      match: [/^\d{10}$/, "Contact number must be exactly 10 digits"], // Ensures valid phone number
    },
    email: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    dob :{ type: Date, required: true },
    diagnosis: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" }, // Optional additional notes

    dateOfAdmission: { type: Date, default: null },
    operationDateTime: { type: Date, default: null },
    dateOfDischarge: { type: Date, default: null },
    dateOfDressing: { type: Date, default: null },

    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
    staffSurgeon: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null }, // Refers to another doctor

    documents: {
      type: [
        {
          fileId: { type: String, required: true }, // Google Drive File ID
          fileName: { type: String, required: true }, // Original file name
          fileUrl: { type: String, required: true }, // Google Drive link
        },
      ],
      default: [],
    }, // Storing document details, ensuring valid structure
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
