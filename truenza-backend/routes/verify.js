const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Product = require("../models/Product");

// Recreate hash using SAME formula as register
function hashProduct(data) {
  const raw = `${data.productName}|${data.expiryDate}|${data.origin}`;
  return "0x" + crypto.createHash("sha256").update(raw).digest("hex");
}

// GET /api/verify/:productId
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found. Check the ID and try again." });
    }

    // Recalculate hash from CURRENT data in DB
    const currentHash = hashProduct({
      productName: product.productName,
      expiryDate: product.expiryDate,
      origin: product.origin,
    });

    // Compare current hash with originally stored hash
    const isValid = currentHash === product.hash;

    return res.json({
      success: true,
      status: isValid ? "valid" : "tampered",
      productId: product.productId,
      product: {
        name: product.productName,
        expiryDate: product.expiryDate,
        origin: product.origin,
        manufacturer: product.manufacturer,
        registeredAt: product.registeredAt,
      },
      expectedHash: product.hash,       // hash at registration time
      actualHash: currentHash,          // hash calculated right now
      blockchainTxHash: product.blockchainTxHash,
      message: isValid
        ? "✅ Product is authentic. Supply chain integrity verified."
        : "❌ TAMPERED: Hash mismatch detected. Product data has been altered.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

module.exports = router;
