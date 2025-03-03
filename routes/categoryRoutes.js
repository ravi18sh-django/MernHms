const express = require("express");
const Category = require("../Models/Category");
const verifyAdmin = require("../middlewares/authMiddleware");

const router = express.Router();

// 🟢 Create a Category (Only Admin)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json({
      isSuccess: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔵 Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟡 Get Single Category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🟠 Update Category (Only Admin)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      isSuccess: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔴 Delete Category (Only Admin)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      isSuccess: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
