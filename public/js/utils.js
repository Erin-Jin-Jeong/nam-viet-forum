// js/utils.js

import { CATEGORY_MAP } from './config.js';

let toastTimeout;

/**
 * Hiển thị thông báo Toast
 * @param {string} msg - Nội dung thông báo
 * @param {number} timeout - Thời gian hiển thị (ms)
 */
export function showToast(msg, timeout = 3000) {
    clearTimeout(toastTimeout);
    const toast = document.getElementById("toast");
    const body = document.getElementById("toast-body");
    body.textContent = msg;
    toast.classList.remove("hidden");
    
    toastTimeout = setTimeout(() => toast.classList.add("hidden"), timeout);
}

/**
 * Tạo header Authorization
 * @param {string} token
 * @returns {object}
 */
export function authHeaders(token) {
    return token ? { "Authorization": "Bearer " + token } : {};
}

/**
 * Lấy tên hiển thị của danh mục từ key
 * @param {string} key - 'growing', 'identification', etc.
 * @returns {{name: string, color: string, emoji: string}}
 */
export function getCategoryDetails(key) {
    return CATEGORY_MAP[key] || { name: "Không xác định", color: "bg-yellow-100 text-yellow-700", emoji: "❓" };
}

/**
 * Chuyển đổi ký tự HTML đặc biệt để tránh XSS
 * @param {string} str - Chuỗi cần escape
 * @returns {string}
 */
export function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

/**
 * Parse payload từ JWT token
 * @param {string} token
 * @returns {object|null}
 */
export function parseJwt(token) {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload;
    } catch (e) { return null; }
}