const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

function generateReportId() {
  return "RPT-" + Date.now().toString(36).toUpperCase();
}

// POST /api/report
router.post("/", async (req, res) => {
  try {
    const { productId, description } = req.body;

    if (!productId || !description) {
      return res.status(400).json({ error: "Missing productId or description" });
    }

    const reportId = generateReportId();

    const report = new Report({ reportId, productId, description });
    await report.save();

    return res.status(201).json({
      success: true,
      reportId,
      message: "Report submitted and logged permanently",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Report submission failed" });
  }
});

// GET /api/report/:productId  — fetch all reports for a product
router.get("/:productId", async (req, res) => {
  try {
    const reports = await Report.find({ productId: req.params.productId });
    return res.json({ success: true, reports });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
