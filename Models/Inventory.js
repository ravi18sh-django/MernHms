const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    supplier: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic", required: true },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
