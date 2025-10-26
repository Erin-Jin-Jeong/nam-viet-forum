// js/api.js

import { POSTS_API } from "./config.js";

/**
 * Lấy danh sách bài viết từ server.
 * @param {number} page - Trang hiện tại.
 * @param {number} limit - Số bài viết trên mỗi trang.
 * @param {string} category - Danh mục để lọc (hoặc rỗng nếu là 'all').
 * @returns {Promise<object>} Dữ liệu JSON từ API.
 */
export async function fetchPosts(page, limit, category) {
  const categoryParam =
    category && category !== "all" ? `&category=${category}` : "";
  const url = `${POSTS_API}?page=${page}&limit=${limit}${categoryParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Không thể tải bài viết");
  }
  return res.json();
}

/**
 * Tạo hoặc cập nhật bài viết.
 * @param {string} token - JWT Token.
 * @param {object} postData - Dữ liệu bài viết.
 * @param {string|null} postId - ID bài viết nếu là cập nhật (PUT).
 * @returns {Promise<object>} Dữ liệu bài viết đã được tạo/cập nhật.
 */
export async function savePost(token, postData, postId = null) {
  const method = postId ? "PUT" : "POST";
  const url = postId ? `${POSTS_API}/${postId}` : POSTS_API;

  const res = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lỗi server khi gửi bài");
  }
  return data;
}

/**
 * Xóa bài viết.
 * @param {string} token - JWT Token.
 * @param {string} postId - ID bài viết cần xóa.
 * @returns {Promise<object>} Phản hồi từ server.
 */
export async function deletePost(token, postId) {
  const res = await fetch(`${POSTS_API}/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Không thể xóa bài viết");
  }
  return data;
}

// js/api.js (Hàm authenticate đã sửa)

// ... (các hàm fetchPosts, savePost, deletePost)

/**
 * Xử lý đăng ký/đăng nhập.
 * @param {string} endpoint - 'login' hoặc 'register'.
 * @param {object} credentials - Email, password và username (nếu đăng ký).
 * @returns {Promise<string>} JWT Token.
 */
export async function authenticate(endpoint, credentials) {
  // FIX: Sử dụng biến AUTH_API đã được import từ config.js
  const res = await fetch(`${AUTH_API}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Xác thực (${endpoint}) thất bại`);
  }
  // Giả định token nằm trong data.token
  return data.token;
}

// /**
//  * Xử lý đăng ký/đăng nhập.
//  * @param {string} endpoint - 'login' hoặc 'register'.
//  * @param {object} credentials - Email, password và username (nếu đăng ký).
//  * @returns {Promise<string>} JWT Token.
//  */
// export async function authenticate(endpoint, credentials) {
//     const AUTH_API = `${POST_API.replace('/posts', '/auth')}`; // Lấy AUTH_API từ POST_API
//     const res = await fetch(`${AUTH_API}/${endpoint}`, {

//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials)
//     });

//     const data = await res.json();
//     if (!res.ok) {
//         throw new Error(data.message || `${endpoint} thất bại`);
//     }
//     // Giả định token nằm trong data.token
//     return data.token;
// }
