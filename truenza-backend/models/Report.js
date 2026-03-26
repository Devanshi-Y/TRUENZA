const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  description: { type: String, required: true },
  location:      String,
  reporterEmail: String,
  txHash:        { type: String, default: "db-only-mode" },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
