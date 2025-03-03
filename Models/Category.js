const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Unique category name (e.g., Medicine, Surgical, Equipment)
    description: { type: String }, // Optional description
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
