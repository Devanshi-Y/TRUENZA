const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  description: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
