
// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
 {
    title: {
 type: String,
 required: true,
 trim: true,
 },
 content: {
 type: String,
 required: true,
 },
    // Dòng mới cần thêm: Định nghĩa trường category
    category: {
        type: String,
        required: true,
        // Tùy chọn: Thêm enum để đảm bảo dữ liệu luôn hợp lệ
        enum: ["growing", "identification", "cooking", "general"], 
        default: "general",
    },
    // Hết dòng mới
 author: {
 type: mongoose.Schema.Types.ObjectId,
 ref: "User", // liên kết User
 required: true,
 },
 },
 { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
