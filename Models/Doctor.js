const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true }, // Links to Clinic
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }], // Links to Patients
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
