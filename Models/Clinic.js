const mongoose = require("mongoose");
require("./Doctor");
require("./Patient");
const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }], 
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
});

const Clinic = mongoose.model("Clinic", clinicSchema);
module.exports = Clinic;
