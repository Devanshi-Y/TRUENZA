const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const { ethers } = require("ethers");
const abi = require("../contract/truenzaABI.json");

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

    // 1. Log on blockchain (optional — falls back silently if it fails)
    let txHash = "db-only-mode";
    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
      const tx = await contract.reportProduct(productId);
      await tx.wait();
      txHash = tx.hash;
    } catch (blockchainErr) {
      console.log("Blockchain report skipped:", blockchainErr.message);
    }

    // 2. Save to MongoDB
    const report = new Report({ reportId, productId, description });
    await report.save();

    return res.status(201).json({
      success: true,
      reportId,
      txHash,
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
