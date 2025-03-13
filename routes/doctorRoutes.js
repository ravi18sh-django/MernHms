const express = require("express");
const Doctor = require("../Models/Doctor");
const verifyAdmin = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Create a new doctor
router.post("/", verifyAdmin, async (req, res) => {
    try {
      const { name, specialization, contact, email, address,clinic } = req.body;
  
      const newDoctor = new Doctor({ name, specialization, contact, email, address,clinic });
      await newDoctor.save();
  
      const response = {  // ✅ Rename from `res` to `response`
          "isSuccess": true,
          "message": "Doctor Created Successfully",
          "data": newDoctor
      };
  
      res.status(201).json(response);  // ✅ Now using Express' `res`
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

// ✅ Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("clinic").populate("patients");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get a single doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("clinic").populate("patients");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update a doctor by ID
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete a doctor by ID
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
