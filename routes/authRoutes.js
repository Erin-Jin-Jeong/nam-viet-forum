const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Đăng ký
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

module.exports = router;
