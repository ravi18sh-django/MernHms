const express = require("express");
const Inventory = require("../Models/Inventory");
const verifyAdmin = require("../middlewares/authMiddleware");

const router = express.Router();

// 🟢 Create Inventory Item (Only Admin)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();

    res.status(201).json({
      isSuccess: true,
      message: "Inventory item created successfully",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 Get All Inventory Items
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find().populate("category clinic");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟡 Get Single Inventory Item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate("category clinic");
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟠 Update Inventory Item (Only Admin)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Inventory item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 Delete Inventory Item (Only Admin)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({
      isSuccess: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
