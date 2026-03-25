const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
