// js/config.js

export const API_BASE = window.location.origin + "/api";
export const POSTS_API = API_BASE + "/posts";
export const AUTH_API = API_BASE + "/auth";

export const CATEGORY_MAP = {
    growing: { name: "Chăm sóc", color: "bg-green-100 text-green-700", emoji: "🍄" },
    identification: { name: "Nhận Dạng", color: "bg-blue-100 text-blue-700", emoji: "🔬" },
    cooking: { name: "Ẩm Thực", color: "bg-red-100 text-red-700", emoji: "🍳" },
    general: { name: "Thảo Luận Chung", color: "bg-gray-200 text-gray-700", emoji: "💬" }
};