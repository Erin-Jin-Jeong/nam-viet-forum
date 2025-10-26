// controllers/userController.js
const getProfile = (req, res) => {
  // req.user được gán trong middleware.protect
  res.json({
    message: "Đây là profile của bạn",
    user: req.user,
  });
};

module.exports = { getProfile };
