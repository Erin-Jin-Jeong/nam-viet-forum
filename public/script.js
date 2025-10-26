const postsContainer = document.getElementById("posts-container");

// 👉 Thêm token JWT của bạn vào đây
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDc0YWE2MDI3ZjVmMjljY2E0MTZkNiIsImlhdCI6MTc1ODkzOTgxNCwiZXhwIjoxNzU5NTQ0NjE0fQ.hydk9O64xnujNcprvXdKLza6xfWxWsep7X73M3rpDfU"; // copy từ Postman login

async function fetchPosts() {
  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      }
    });

    if (!res.ok) {
      throw new Error("Lỗi khi fetch bài viết");
    }

    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    postsContainer.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post-card");
    div.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <div class="author">🖊️ ${post.author.username} | ${new Date(post.createdAt).toLocaleString()}</div>
    `;
    postsContainer.appendChild(div);
  });
}

// Load posts khi mở trang
fetchPosts();
