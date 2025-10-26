// js/main.js

import {
  showToast,
  escapeHtml,
  getCategoryDetails,
  parseJwt,
} from "./utils.js";
import { fetchPosts, savePost, deletePost } from "./api.js";
import { updateAuthUI, setPostReloadCallback } from "./auth1.js";
import { CATEGORY_MAP } from "./config.js";

/* =========================
    State
    ========================= */
let state = {
  posts: [],
  page: 1,
  pageSize: 10,
  token: localStorage.getItem("token") || null,
  editingPostId: null,
  currentCategory: "all",
  currentSearch: "",
};

/* =========================
    Render Functions
    ========================= */

/**
 * Tạo thẻ bài viết (post card) HTML
 * (Sử dụng state.token trong logic action buttons)
 */
function postCardHTML(p) {
  const title = escapeHtml(p.title);
  const content = escapeHtml(p.content);
  const author = p.author?.username || "Ẩn danh";
  const created = new Date(p.createdAt).toLocaleString();
  const likes = Array.isArray(p.likes) ? p.likes.length : 0;
  const comments = Array.isArray(p.comments) ? p.comments.length : 0;

  const category = getCategoryDetails(p.category);

  let actions = "";
  try {
    const payload = parseJwt(state.token);
    if (
      payload &&
      (payload.id === (p.author?._id || p.author) || payload.role === "admin")
    ) {
      actions = `
                <button data-id="${p._id}" class="btn-edit text-sm text-emerald-700 px-2 py-1 border rounded">Sửa</button>
                <button data-id="${p._id}" class="btn-delete text-sm text-red-600 px-2 py-1 border rounded">Xóa</button>
            `;
    }
  } catch (e) {
    /* ignore */
  }

  return `
        <article class="bg-white p-5 rounded-lg shadow">
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold">${title}</h3>
                <div class="flex gap-2">${actions}</div>
            </div>
            
            <span class="inline-block ${category.color} text-xs font-medium px-2.5 py-0.5 rounded-full mt-1">
                ${category.emoji} ${category.name}
            </span>

            <p class="mt-3 text-gray-700 line-clamp-3"> ${content}</p>
            <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div>👤 ${author} • ${created}</div>
                <div class="flex items-center gap-4">
                    <div>
                        <i class="fa-regular fa-heart" style="color: #f20202;"></i> ${likes}
                    </div>
                
                    <div><i class="fa-regular fa-comment" style="color: #74C0FC;"></i> ${comments}</div>
                </div>
            </div>
        </article>
    `;
}

/**
 * Lọc bài viết dựa trên tìm kiếm (local) và render ra feed
 */
function filterAndRenderFeed() {
  const feed = document.getElementById("feed");

  const q = state.currentSearch.toLowerCase();
  const filteredBySearch = state.posts.filter((p) =>
    (p.title + " " + p.content + " " + (p.author?.username || ""))
      .toLowerCase()
      .includes(q)
  );

  if (!filteredBySearch.length) {
    feed.innerHTML = `<div class="bg-white p-6 rounded shadow text-center text-gray-600">Không tìm thấy bài viết nào phù hợp.</div>`;
    return;
  }

  feed.innerHTML = filteredBySearch.map(postCardHTML).join("");
}

/* =========================
    Post Data Logic
    ========================= */

/**
 * Tải bài viết từ API và cập nhật state/UI
 * @param {boolean} replace - True nếu muốn thay thế (reset) danh sách hiện tại
 */
export async function loadPosts(replace = true) {
  try {
    const posts = await fetchPosts(
      state.page,
      state.pageSize,
      state.currentCategory
    );

    // Thêm category ngẫu nhiên nếu API thiếu (như logic cũ)
    const postsToUse = posts.map((p) => {
      if (!p.category) {
        const keys = Object.keys(CATEGORY_MAP);
        p.category = keys[Math.floor(Math.random() * keys.length)];
      }
      return p;
    });

    if (replace) state.posts = postsToUse;
    else state.posts = state.posts.concat(postsToUse);

    filterAndRenderFeed();

    // stats
    document.getElementById("stat-posts").textContent = state.posts.length;

    const btnLoadMore = document.getElementById("btn-load-more");
    if (posts.length < state.pageSize && replace === false) {
      btnLoadMore.style.display = "none";
    } else {
      btnLoadMore.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    showToast(err.message || "Lỗi tải bài viết");
  }
}

/* =========================
    Modal Handlers
    ========================= */

function openCreateModal() {
  state.editingPostId = null;
  document.getElementById("modal-post").classList.remove("hidden");
  // Cần thêm logic mở backdrop nếu chưa có trong index.html
  document.getElementById("modal-backdrop").classList.remove("hidden");
  document.getElementById("modal-post-title").textContent = "Tạo bài viết";
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("post-category").value = "general";
}

function openEditModal(post) {
  state.editingPostId = post._id;
  document.getElementById("modal-post").classList.remove("hidden");
  // Cần thêm logic mở backdrop nếu chưa có trong index.html
  document.getElementById("modal-backdrop").classList.remove("hidden");
  document.getElementById("modal-post-title").textContent =
    "Chỉnh sửa bài viết";
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-content").value = post.content;
  document.getElementById("post-category").value = post.category || "general";
}

/* =========================
    Event Listeners
    ========================= */

// Load More
document.getElementById("btn-load-more").addEventListener("click", async () => {
  state.page++;
  await loadPosts(false);
});

// -------------------------------------------------------------------
// FIX: Search Handler MỚI (Xử lý sự kiện tìm kiếm và đồng bộ)
// -------------------------------------------------------------------

/**
 * Gán sự kiện 'input' cho thanh tìm kiếm và đồng bộ giá trị giữa 2 thanh (mobile/desktop).
 * @param {string} inputElementId - ID của thanh tìm kiếm.
 */
function attachSearchHandler(inputElementId) {
  const inputElement = document.getElementById(inputElementId);
  if (inputElement) {
    inputElement.addEventListener("input", (e) => {
      const searchValue = e.target.value.trim();
      state.currentSearch = searchValue;
      filterAndRenderFeed();

      // Đồng bộ giá trị giữa hai thanh tìm kiếm
      const otherInputId =
        inputElementId === "searchInput" ? "desktopSearchInput" : "searchInput";
      const otherInput = document.getElementById(otherInputId);

      // Cập nhật giá trị của thanh tìm kiếm còn lại nếu nó khác
      if (otherInput && otherInput.value !== searchValue) {
        otherInput.value = searchValue;
      }
    });
  }
}

// Gán sự kiện cho cả hai thanh tìm kiếm với ID đã sửa trong index.html
attachSearchHandler("searchInput"); // Thanh tìm kiếm Mobile
attachSearchHandler("desktopSearchInput"); // Thanh tìm kiếm Desktop

// -------------------------------------------------------------------
// END FIX: Search Handler MỚI
// -------------------------------------------------------------------

// Logout (cập nhật lại token và UI, gọi loadPosts)
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  state.token = null;
  updateAuthUI(state.token);
  showToast("Đã đăng xuất");
  loadPosts(true);
});

// Post Modal - Submit
document.getElementById("form-post").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!state.token) {
    showToast("Bạn cần đăng nhập để thực hiện");
    return;
  }

  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  const category = document.getElementById("post-category").value;

  if (!title || !content) {
    showToast("Vui lòng điền tiêu đề và nội dung");
    return;
  }

  try {
    const postData = { title, content, category };
    await savePost(state.token, postData, state.editingPostId);

    document.getElementById("modal-post").classList.add("hidden");
    document.getElementById("modal-backdrop").classList.add("hidden"); // Tắt backdrop khi submit xong

    showToast(
      state.editingPostId ? "Cập nhật bài thành công" : "Tạo bài thành công"
    );

    state.page = 1;
    await loadPosts(true);
  } catch (err) {
    console.error(err);
    showToast(err.message || "Lỗi khi gửi bài");
  }
});

// Global Event Delegation (Delete, Edit, Category Filter, Create Button)
document.addEventListener("click", async (e) => {
  // Delete
  if (e.target.matches(".btn-delete")) {
    const id = e.target.dataset.id;
    if (!confirm("Bạn có chắc muốn xóa bài này?")) return;
    if (!state.token) {
      showToast("Bạn cần đăng nhập để thực hiện");
      return;
    }
    try {
      await deletePost(state.token, id);
      showToast("Đã xóa bài");
      state.page = 1;
      await loadPosts(true);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Lỗi khi xóa bài");
    }
  }

  // Edit
  if (e.target.matches(".btn-edit")) {
    const id = e.target.dataset.id;
    const post = state.posts.find((p) => p._id === id);
    if (!post) {
      showToast("Bài không tồn tại");
      return;
    }
    openEditModal(post);
  }

  // Create Button
  if (e.target.matches("#btn-open-create")) {
    openCreateModal();
  }

  // Category Filter
  if (e.target.closest(".category-item")) {
    const item = e.target.closest(".category-item");
    const categoryKey = item.dataset.category;

    if (categoryKey !== state.currentCategory) {
      state.currentCategory = categoryKey;
      state.page = 1;

      document
        .querySelectorAll(".category-item")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      await loadPosts(true);

      // FIX: Reset giá trị của cả hai thanh tìm kiếm sau khi lọc danh mục
      const mobileSearchInput = document.getElementById("searchInput");
      const desktopSearchInput = document.getElementById("desktopSearchInput");

      if (mobileSearchInput) mobileSearchInput.value = "";
      if (desktopSearchInput) desktopSearchInput.value = "";

      state.currentSearch = "";
    }
  }

  // Close Modals on Backdrop Click (logic cũ)
  document.querySelectorAll('[id^="modal-"]').forEach((mod) => {
    if (e.target === mod) mod.classList.add("hidden");
  });
});

/* =========================
    Init
    ========================= */
(function init() {
  // Thiết lập callback để auth.js gọi lại sau khi đăng nhập/đăng ký thành công
  setPostReloadCallback(() => {
    state.token = localStorage.getItem("token"); // Cập nhật token sau khi auth thành công
    state.page = 1;
    loadPosts(true);
  });

  updateAuthUI(state.token);
  loadPosts(true);
})();
