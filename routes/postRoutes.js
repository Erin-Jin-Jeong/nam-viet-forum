const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");

// 📌 Tạo bài viết mới
router.post("/", protect, async (req, res) => {
  try {
    // Thêm 'category' vào đây
    const { title, content, category } = req.body;

    // Tùy chọn: Kiểm tra category có hợp lệ không (ví dụ: chỉ cho phép các giá trị đã định nghĩa)
    if (!title || !content || !category)
      // Đã thêm kiểm tra category
      return res
        .status(400)
        .json({ message: "Thiếu tiêu đề, nội dung, hoặc danh mục" });

    const post = await Post.create({
      title,
      content,
      category, // <== Đã thêm trường category
      author: req.user._id,
    });
    // ... (phần còn lại giữ nguyên)
    // router.post("/", protect, async (req, res) => {
    //   try {
    //     const { title, content } = req.body;
    //     if (!title || !content)
    //       return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung" });

    //     const post = await Post.create({
    //       title,
    //       content,
    //       author: req.user._id,
    //     });

    const populatedPost = await post.populate("author", "username email");
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi tạo bài viết" });
  }
});

// 📌 Lấy tất cả bài viết
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // Lấy tham số category từ URL (ví dụ: ?category=growing)

    // Tạo đối tượng bộ lọc. Mặc định là rỗng (lấy tất cả)
    const filter = {};

    // Nếu có tham số category được gửi lên và không phải là 'all'
    if (category && category !== "all") {
      filter.category = category; // Thêm điều kiện lọc: { category: 'growing' }
    }

    const posts = await Post.find(filter) // <== Sử dụng đối tượng lọc
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    // router.get("/", async (req, res) => {
    //   try {
    //     const posts = await Post.find()
    //       .populate("author", "username email")
    //       .sort({ createdAt: -1 });
    //     res.json(posts);
    //   } catch (error) {

    res.status(500).json({ message: "Lỗi server khi lấy bài viết" });
  }
});

// 📌 Cập nhật bài viết (chỉ author)
router.put("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // Kiểm tra quyền sở hữu
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa bài này" });
    }
    // kiểm tra quyền sở hữu
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    // <== Thêm dòng này: Cập nhật category nếu nó tồn tại trong req.body
    post.category = req.body.category || post.category;

    const updatedPost = await post.save();

    const populated = await updatedPost.populate("author", "username email");
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi cập nhật bài viết" });
  }
});

// 📌 Xóa bài viết (chỉ author hoặc admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bài này" });
    }

    await post.deleteOne();
    res.json({ message: "Đã xóa bài viết thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi xóa bài viết" });
  }
});

module.exports = router;
