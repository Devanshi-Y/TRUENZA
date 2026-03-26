const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const registerRoute = require("./routes/register");
const verifyRoute = require("./routes/verify");
const reportRoute = require("./routes/report");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/truenza")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/register", registerRoute);
app.use("/api/verify", verifyRoute);
app.use("/api/report", reportRoute);

// Health check
app.get("/", (req, res) => res.json({ status: "Truenza backend running" }));

// Demo tamper route - for hackathon demonstration only
app.post('/api/tamper/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.expiryDate = '2020-01-01';
    await product.save();
    
    res.json({ success: true, message: 'Product tampered for demo', productId: req.params.productId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
