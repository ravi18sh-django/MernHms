const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0 }, // Prevents negative age
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact: { type: String, required: true, unique: true, trim: true, minlength: 10 },
  address: { type: String, trim: true },

  diagnosis: { type: String, required: true, trim: true },
  treatment: { type: String, trim: true },
  investigation: { type: String, trim: true },

  dateOfAdmission: { type: Date, default: null },
  operationDateTime: { type: Date, default: null },
  dateOfDischarge: { type: Date, default: null },
  dateOfDressing: { type: Date, default: null },

  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
  
  staffSurgeon: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null }, // Changed to ObjectId if referring to a surgeon
}, { timestamps: true }); // Adds createdAt & updatedAt automatically

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
