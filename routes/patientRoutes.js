const express = require("express");
const Patient = require("../Models/Patient"); 

const verifyAdmin = require("../middlewares/authMiddleware"); 
const router = express.Router();

// ✅ CREATE a new patient
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const patientData = req.body;
    const newPatient = new Patient(patientData);
    await newPatient.save();

    res.status(201).json({
      isSuccess: true,
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().populate("doctor clinic staffSurgeon");
    res.status(200).json({
      isSuccess: true,
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET a single patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("doctor clinic staffSurgeon");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({
      isSuccess: true,
      message: "Patient found",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE a patient by ID
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({
      isSuccess: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE a patient by ID
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({
      isSuccess: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
