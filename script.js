// Article Management System
const API_BASE = "process/"
let authSession = {authenticated:false,csrfToken:""};
async function refreshAuth(){try{const response=await fetch(API_BASE+"session.php",{credentials:"same-origin"});authSession=await response.json()}catch{authSession={authenticated:false,csrfToken:""}}return authSession}
async function requireAuth(){const auth=await refreshAuth();if(!auth.authenticated){alert("Login admin diperlukan untuk mengubah artikel.");window.location.href=API_BASE+"login.php";return false}return true}

// Load articles on page load
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("articlesContainer")
  if (container) {
    loadArticles()
  }

  // Character counter for form inputs
  const titleInput = document.getElementById("title")
  const leadTextarea = document.getElementById("lead")
  const contentTextarea = document.getElementById("content")

  if (titleInput) {
    titleInput.addEventListener("input", (e) => {
      updateCharCount(e.target, 100)
    })
  }

  if (leadTextarea) {
    leadTextarea.addEventListener("input", (e) => {
      updateCharCount(e.target, 300)
    })
  }

  if (contentTextarea) {
    contentTextarea.addEventListener("input", (e) => {
      updateCharCount(e.target, 5000)
    })
  }

  // Load article data if editing
  const articleId = new URLSearchParams(window.location.search).get("id")
  if (articleId && document.getElementById("editArticleForm")) {
    loadArticleForEdit(articleId)
  }

  // Handle form submission
  const form = document.getElementById("articleForm")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      submitArticle()
    })
  }

  const editForm = document.getElementById("editArticleForm")
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault()
      submitEditArticle()
    })
  }
})

// Load all articles
function loadArticles() {
  const container = document.getElementById("articlesContainer")
  container.innerHTML = '<div class="loading">Memuat artikel...</div>'

  fetch(API_BASE + "get_articles.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.articles.length > 0) {
        container.innerHTML = data.articles.map((article) => createArticleCard(article)).join("")
      } else {
        container.innerHTML = `
                    <div class="empty-state">
                        <h3>Belum Ada Artikel</h3>
                        <p>Mulai dengan membuat artikel baru untuk ditampilkan di sini.</p>
                        <a href="add-article.html" class="btn btn-primary">
                            <span class="icon">+</span>
                            Buat Artikel Pertama
                        </a>
                    </div>
                `
      }
    })
    .catch((error) => {
      console.error("Error loading articles:", error)
      container.innerHTML =
        '<div class="empty-state"><h3>Terjadi Kesalahan</h3><p>Gagal memuat artikel. Silakan coba lagi.</p></div>'
    })
}

// Create article card HTML
function createArticleCard(article) {
  const truncatedTitle = article.judul.length > 60 ? article.judul.substring(0, 60) + "..." : article.judul
  const truncatedLead = article.lead.length > 120 ? article.lead.substring(0, 120) + "..." : article.lead

  return `
        <div class="article-card">
            <h3 class="article-title">${escapeHtml(truncatedTitle)}</h3>
            <div class="article-meta">
                <span class="article-author">Oleh: ${escapeHtml(article.penulis)}</span>
                <span class="article-date">${formatDate(article.waktu)}</span>
            </div>
            <p class="article-lead">${escapeHtml(truncatedLead)}</p>
            <div class="article-actions">
                <a href="edit-article.html?id=${article.articleID}" class="article-edit">
                    <span>✎</span> Edit
                </a>
                <button class="article-delete" onclick="openDeleteModal(${Number(article.articleID)})">
                    <span>🗑</span> Hapus
                </button>
            </div>
        </div>
    `
}

// Update character count
function updateCharCount(element, maxLength) {
  const nextElement = element.nextElementSibling
  if (nextElement && nextElement.classList.contains("char-count")) {
    const currentLength = element.value.length
    nextElement.textContent = `${currentLength}/${maxLength}`

    if (currentLength > maxLength * 0.9) {
      nextElement.style.color = "#fca5a5"
    } else {
      nextElement.style.color = "var(--gray-muted)"
    }
  }
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Submit new article
async function submitArticle() {
  const form = document.getElementById("articleForm")
  const formData = new FormData(form)
  if(!await requireAuth()) return;
  formData.set("csrf_token",authSession.csrfToken)

  fetch(API_BASE + "add_article.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Artikel berhasil ditambahkan!")
        window.location.href = "index.html"
      } else {
        alert("Error: " + (data.message || "Gagal menambahkan artikel"))
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    })
}

// Load article for editing
async function loadArticleForEdit(articleId) {
  if(!await requireAuth()) return;
  fetch(API_BASE + "get_article.php?id=" + encodeURIComponent(articleId))
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const article = data.article
        document.getElementById("articleId").value = article.articleID
        document.getElementById("title").value = article.judul
        document.getElementById("author").value = article.penulis
        document.getElementById("lead").value = article.lead
        document.getElementById("content").value = article.content

        // Update char counts
        updateCharCount(document.getElementById("title"), 100)
        updateCharCount(document.getElementById("lead"), 300)
        updateCharCount(document.getElementById("content"), 5000)
      } else {
        alert("Artikel tidak ditemukan")
        window.location.href = "index.html"
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Terjadi kesalahan memuat artikel")
      window.location.href = "index.html"
    })
}

// Submit edited article
async function submitEditArticle() {
  const form = document.getElementById("editArticleForm")
  const formData = new FormData(form)

  fetch(API_BASE + "update_article.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Artikel berhasil diperbarui!")
        window.location.href = "index.html"
      } else {
        alert("Error: " + (data.message || "Gagal memperbarui artikel"))
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    })
}

// Delete modal functions
let deleteArticleId = null

function openDeleteModal(articleId, articleTitle) {
  deleteArticleId = articleId
  const modal = document.getElementById("deleteModal")
  modal.classList.add("active")
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal")
  modal.classList.remove("active")
  deleteArticleId = null
}

// Confirm delete
document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirmDeleteBtn")
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (deleteArticleId) {
        deleteArticle(deleteArticleId)
      }
    })
  }
})

// Delete article
async function deleteArticle(articleId) {
  if(!await requireAuth()) return;
  fetch(API_BASE + "delete_article.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleID: articleId }),
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": authSession.csrfToken },
  })
    .then((response) => response.json())
    .then((data) => {
      closeDeleteModal()
      if (data.success) {
        alert("Artikel berhasil dihapus!")
        loadArticles()
      } else {
        alert("Error: " + (data.message || "Gagal menghapus artikel"))
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
      closeDeleteModal()
    })
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("deleteModal")
  if (modal && e.target === modal) {
    closeDeleteModal()
  }
})
