const express = require("express");
const crypto = require("crypto");
const { ethers } = require("ethers");
const router = express.Router();
const Product = require("../models/Product");
require("dotenv").config();

// Generate unique product ID
function generateProductId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TRZ-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// Generate SHA-256 hash from product data
function hashProduct(data) {
  const raw = `${data.productName}|${data.expiryDate}|${data.origin}`;
  return "0x" + crypto.createHash("sha256").update(raw).digest("hex");
}

// POST /api/register
router.post("/", async (req, res) => {
  try {
    const { productName, expiryDate, origin, manufacturer } = req.body;

    if (!productName || !expiryDate || !origin) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const productId = generateProductId();
    const hash = hashProduct({ productName, expiryDate, origin });

    let blockchainTxHash = "simulated-" + Date.now();

    // ── Blockchain integration (runs if env vars are set) ──────────────────
    if (process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS && process.env.RPC_URL) {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const abi = [
          "function registerProduct(string memory productId, string memory hash) public",
        ];
        const contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          abi,
          wallet
        );

        const tx = await contract.registerProduct(productId, hash);
        await tx.wait();
        blockchainTxHash = tx.hash;
        console.log("⛓️  Blockchain tx:", blockchainTxHash);
      } catch (bcErr) {
        console.warn("⚠️  Blockchain call failed, continuing with DB only:", bcErr.message);
      }
    }
    // ───────────────────────────────────────────────────────────────────────

    const product = new Product({
      productId,
      productName,
      expiryDate,
      origin,
      manufacturer: manufacturer || "Registered via Truenza",
      hash,
      blockchainTxHash,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      productId,
      hash,
      blockchainTxHash,
      message: "Product registered and anchored on blockchain",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Registration failed", details: err.message });
  }
});

module.exports = router;
