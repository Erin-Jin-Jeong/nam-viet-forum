
// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📌 Mount API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// 📌 Serve frontend tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// 📌 Serve frontend cho tất cả route không phải /api
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next(); // bỏ qua các API
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📌 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





