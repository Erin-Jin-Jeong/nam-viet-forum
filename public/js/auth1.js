// js/auth.js

import { showToast } from './utils.js';
import { authenticate } from './api.js';

// Hàm tham chiếu trong main.js để gọi lại
let postReloadCallback = () => {};

/**
 * Thiết lập hàm callback để gọi lại việc tải bài viết sau khi đăng nhập/đăng xuất
 * @param {function} callback 
 */
export function setPostReloadCallback(callback) {
    postReloadCallback = callback;
}

/**
 * Cập nhật trạng thái các nút Đăng nhập/Đăng ký/Đăng xuất và Tạo bài.
 * @param {string|null} token - JWT Token hiện tại
 */
export function updateAuthUI(token) {
    const loggedIn = !!token;
    document.getElementById("btn-open-login").classList.toggle("hidden", loggedIn);
    document.getElementById("btn-open-register").classList.toggle("hidden", loggedIn);
    document.getElementById("btn-logout").classList.toggle("hidden", !loggedIn);
    
    // Nút tạo bài viết
    const btnCreate = document.getElementById("btn-open-create");
    if (btnCreate) {
        if (loggedIn) {
            btnCreate.classList.remove("hidden");
        } else {
            // Giữ lại lớp 'hidden' gốc
            if (!btnCreate.classList.contains("md:inline-flex")) {
                 btnCreate.classList.add("hidden");
            }
        }
    }
}

// Xử lý đăng nhập
document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pass").value;
    
    try {
        const token = await authenticate('login', { email, password });
        localStorage.setItem("token", token);
        document.getElementById("modal-login").classList.add("hidden");
        
        updateAuthUI(token);
        showToast("Đăng nhập thành công");
        postReloadCallback(token);
        return token;
    } catch (err) {
        console.error(err);
        showToast(err.message || "Lỗi khi đăng nhập");
    }
});

// Xử lý đăng ký
document.getElementById("form-register").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-pass").value;
    
    try {
        const token = await authenticate('register', { username, email, password });
        localStorage.setItem("token", token);
        document.getElementById("modal-register").classList.add("hidden");
        
        updateAuthUI(token);
        showToast("Đăng ký thành công");
        postReloadCallback(token);
        return token;
    } catch (err) {
        console.error(err);
        showToast(err.message || "Lỗi khi đăng ký");
    }
});