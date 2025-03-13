const express = require("express");
const router = express.Router();
const Clinic = require("../Models/Clinic");

// ✅ **1. Create a Clinic**
router.post("/", async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    console.log('clininc body',req.body)
    const clinic = new Clinic({ name, address, contact });
    await clinic.save();
    res.status(201).json(clinic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ **2. Get All Clinics**
router.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find().populate("doctors").populate("patients");
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ **3. Get a Single Clinic by ID**
router.get("/:id", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate("doctors").populate("patients");
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ **4. Update a Clinic**
router.put("/:id", async (req, res) => {
  try {
    const updatedClinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClinic) return res.status(404).json({ message: "Clinic not found" });
    res.status(200).json(updatedClinic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ **5. Delete a Clinic**
router.delete("/:id", async (req, res) => {
  try {
    const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!deletedClinic) return res.status(404).json({ message: "Clinic not found" });
    res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
