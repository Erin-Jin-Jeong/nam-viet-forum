
// // js/auth.js

// import { showToast } from './utils.js';
// import { authenticate } from './api.js';

// let postReloadCallback = () => {};

// /**
//  * Thiết lập hàm callback để gọi lại việc tải bài viết sau khi đăng nhập/đăng xuất
//  * @param {function} callback 
//  */
// export function setPostReloadCallback(callback) {
//     postReloadCallback = callback;
// }

// /**
//  * Cập nhật trạng thái các nút Auth và Tạo bài.
//  * @param {string|null} token - JWT Token hiện tại
//  * @param {string|null} username - Tên người dùng hiện tại
//  */
// export function updateAuthUI(token, username = null) {
//     const loggedIn = !!token;
//     document.getElementById("btn-open-login").classList.toggle("hidden", loggedIn);
//     document.getElementById("btn-open-register").classList.toggle("hidden", loggedIn);
//     document.getElementById("btn-logout").classList.toggle("hidden", !loggedIn);
    
//     // Thêm logic hiển thị tên người dùng
//     const greetingElement = document.getElementById("auth-greeting");
//     if (greetingElement) {
//         greetingElement.classList.toggle("hidden", !loggedIn);
//         // Hiển thị tên người dùng nếu có
//         greetingElement.textContent = loggedIn && username ? `Xin chào, ${username}!` : '';
//     }

//     // Nút tạo bài viết (Desktop)
//     const btnCreate = document.getElementById("btn-open-create");
//     if (btnCreate) {
//         btnCreate.classList.toggle("hidden", !loggedIn);
//     }
//     // Nút tạo bài viết (Mobile)
//     const btnCreateMobile = document.getElementById("btn-open-create-mobile");
//     if (btnCreateMobile) {
//         btnCreateMobile.classList.toggle("hidden", !loggedIn);
//     }
// }

// // Hàm tiện ích để đóng cả modal và backdrop
// function closeModalAndBackdrop(modalId) {
//     document.getElementById(modalId).classList.add("hidden");
//     document.getElementById("modal-backdrop").classList.add("hidden");
// }


// // Xử lý đăng nhập
// document.getElementById("form-login").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("login-email").value;
//     const password = document.getElementById("login-pass").value;
    
//     try {
//         // API giờ trả về { token: '...', username: '...' }
//         const { token, username } = await authenticate('login', { email, password }); 
        
//         localStorage.setItem("token", token);
//         localStorage.setItem("username", username); // LƯU TÊN NGƯỜI DÙNG

//         // Đóng modal và backdrop sau khi thành công
//         closeModalAndBackdrop("modal-login");
        
//         // Cập nhật UI với token và username
//         updateAuthUI(token, username); 
//         showToast(`Đăng nhập thành công! Xin chào, ${username}`); 
//         postReloadCallback(token);
//     } catch (err) {
//         console.error("Login Error:", err);
//         showToast(err.message || "Lỗi khi đăng nhập");
//     }
// });

// // Xử lý đăng ký
// document.getElementById("form-register").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById("reg-username").value;
//     const email = document.getElementById("reg-email").value;
//     const password = document.getElementById("reg-pass").value;
    
//     try {
//         // API giờ trả về { token: '...', username: '...' }
//         // Đổi tên biến để tránh trùng lặp với username khai báo ở trên
//         const { token, username: returnedUsername } = await authenticate('register', { username, email, password });
        
//         localStorage.setItem("token", token);
//         localStorage.setItem("username", returnedUsername); // LƯU TÊN NGƯỜI DÙNG
        
//         // Đóng modal và backdrop sau khi thành công
//         closeModalAndBackdrop("modal-register");
        
//         // Cập nhật UI với token và username
//         updateAuthUI(token, returnedUsername);
//         showToast(`Đăng ký thành công! Xin chào, ${returnedUsername}`); 
//         postReloadCallback(token);
//     } catch (err) {
//         console.error("Register Error:", err);
//         showToast(err.message || "Lỗi khi đăng ký");
//     }
// });


// // Xử lý đăng xuất
// document.getElementById("btn-logout").addEventListener("click", () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("username"); // Xóa tên người dùng
//     updateAuthUI(null, null); // Cập nhật UI về trạng thái đăng xuất
//     showToast("Đã đăng xuất");
//     postReloadCallback(null);
// });


// // Khởi tạo trạng thái UI khi tải trang
// const initialToken = localStorage.getItem("token");
// const initialUsername = localStorage.getItem("username");
// updateAuthUI(initialToken, initialUsername);


// // js/auth.js

// import { showToast } from './utils.js';
// import { authenticate } from './api.js';

// let postReloadCallback = () => {};

// /**
//  * Thiết lập hàm callback để gọi lại việc tải bài viết sau khi đăng nhập/đăng xuất
//  * @param {function} callback 
//  */
// export function setPostReloadCallback(callback) {
//     postReloadCallback = callback;
// }

// /**
//  * Cập nhật trạng thái các nút Auth và Tạo bài.
//  * @param {string|null} token - JWT Token hiện tại
//  * @param {string|null} username - Tên người dùng hiện tại (MỚI)
//  */
// export function updateAuthUI(token, username = null) {
//     const loggedIn = !!token;
//     document.getElementById("btn-open-login").classList.toggle("hidden", loggedIn);
//     document.getElementById("btn-open-register").classList.toggle("hidden", loggedIn);
//     document.getElementById("btn-logout").classList.toggle("hidden", !loggedIn);
    
//     // Thêm logic hiển thị tên người dùng (Nếu có thẻ chào mừng)
//     const greetingElement = document.getElementById("auth-greeting");
//     if (greetingElement) {
//         greetingElement.classList.toggle("hidden", !loggedIn);
//         greetingElement.textContent = loggedIn && username ? `Xin chào, ${username}!` : '';
//     }

//     // Nút tạo bài viết (Desktop)

//     // ... (logic tạo bài viết giữ nguyên)
//     const btnCreate = document.getElementById("btn-open-create");
//     if (btnCreate) {
//         btnCreate.classList.toggle("hidden", !loggedIn);
//     }
//     // Nút tạo bài viết (Mobile)
//     const btnCreateMobile = document.getElementById("btn-open-create-mobile");
//     if (btnCreateMobile) {
//         btnCreateMobile.classList.toggle("hidden", !loggedIn);
//     }
// }

// // ... (Hàm closeModalAndBackdrop giữ nguyên)

// // Xử lý đăng nhập
// document.getElementById("form-login").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const email = document.getElementById("login-email").value;
//     const password = document.getElementById("login-pass").value;
    
//     try {
//         // API giờ trả về { token: '...', username: '...' }
//         const { token, username } = await authenticate('login', { email, password }); 
        
//         localStorage.setItem("token", token);
//         localStorage.setItem("username", username); // LƯU TÊN NGƯỜI DÙNG MỚI

//         closeModalAndBackdrop("modal-login");
        
//         // Truyền cả username khi cập nhật UI
//         updateAuthUI(token, username); 
//         showToast(`Đăng nhập thành công! Xin chào, ${username}`); // HIỂN THỊ TÊN TRONG TOAST
//         postReloadCallback(token);
//     } catch (err) {
//         console.error("Login Error:", err);
//         showToast(err.message || "Lỗi khi đăng nhập");
//     }
// });

// // Xử lý đăng ký
// document.getElementById("form-register").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById("reg-username").value;
//     const email = document.getElementById("reg-email").value;
//     const password = document.getElementById("reg-pass").value;
    
//     try {
//         // API giờ trả về { token: '...', username: '...' }
//         const { token, username: returnedUsername } = await authenticate('register', { username, email, password });
        
//         localStorage.setItem("token", token);
//         localStorage.setItem("username", returnedUsername); // LƯU TÊN NGƯỜI DÙNG MỚI
        
//         closeModalAndBackdrop("modal-register");
        
//         // Truyền cả username khi cập nhật UI
//         updateAuthUI(token, returnedUsername);
//         showToast(`Đăng ký thành công! Xin chào, ${returnedUsername}`); // HIỂN THỊ TÊN TRONG TOAST
//         postReloadCallback(token);
//     } catch (err) {
//         console.error("Register Error:", err);
//         showToast(err.message || "Lỗi khi đăng ký");
//     }
// });

// // Bổ sung logic kiểm tra khi tải trang
// const initialToken = localStorage.getItem("token");
// const initialUsername = localStorage.getItem("username");
// updateAuthUI(initialToken, initialUsername);








// js/auth.js

import { showToast } from './utils.js';
import { authenticate } from './api.js';

let postReloadCallback = () => {};

/**
 * Thiết lập hàm callback để gọi lại việc tải bài viết sau khi đăng nhập/đăng xuất
 * @param {function} callback 
 */
export function setPostReloadCallback(callback) {
    postReloadCallback = callback;
}

/**
 * Cập nhật trạng thái các nút Auth và Tạo bài.
 * @param {string|null} token - JWT Token hiện tại
 */
export function updateAuthUI(token) {
    const loggedIn = !!token;
    document.getElementById("btn-open-login").classList.toggle("hidden", loggedIn);
    document.getElementById("btn-open-register").classList.toggle("hidden", loggedIn);
    document.getElementById("btn-logout").classList.toggle("hidden", !loggedIn);
    
    // Nút tạo bài viết (Desktop)
    const btnCreate = document.getElementById("btn-open-create");
    if (btnCreate) {
        btnCreate.classList.toggle("hidden", !loggedIn);
    }
    // Nút tạo bài viết (Mobile)
    const btnCreateMobile = document.getElementById("btn-open-create-mobile");
    if (btnCreateMobile) {
        btnCreateMobile.classList.toggle("hidden", !loggedIn);
    }
}

// Hàm tiện ích để đóng cả modal và backdrop
function closeModalAndBackdrop(modalId) {
    document.getElementById(modalId).classList.add("hidden");
    document.getElementById("modal-backdrop").classList.add("hidden");
}


// Xử lý đăng nhập
document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pass").value;
    
    try {
        const token = await authenticate('login', { email, password });
        localStorage.setItem("token", token);
        
        // FIX: Đóng modal và backdrop sau khi thành công
        closeModalAndBackdrop("modal-login");
        
        updateAuthUI(token);
        showToast("Đăng nhập thành công");
        postReloadCallback(token);
    } catch (err) {
        console.error("Login Error:", err);
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
        
        // FIX: Đóng modal và backdrop sau khi thành công
        closeModalAndBackdrop("modal-register");
        
        updateAuthUI(token);
        showToast("Đăng ký thành công");
        postReloadCallback(token);
    } catch (err) {
        console.error("Register Error:", err);
        showToast(err.message || "Lỗi khi đăng ký");
    }
});