const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  expiryDate: { type: String, required: true },
  origin: { type: String, required: true },
  manufacturer: { type: String, default: "Registered via Truenza" },
  hash: { type: String, required: true },       // original hash stored at registration
  blockchainTxHash: { type: String, default: "simulated" }, // tx hash from blockchain
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
