// Dark Mode Toggle
function initDarkMode() {
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const theme = document.body.classList.contains("dark-mode")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
}

// Search Functionality
function initSearch() {
  // Support two input id variants used across pages: `searchInput` and legacy `commandSearch`
  const searchInput =
    document.getElementById("searchInput") ||
    document.getElementById("commandSearch");
  const searchBtn =
    document.getElementById("searchBtn") ||
    document.getElementById("searchButton");
  const resetBtn =
    document.getElementById("resetBtn") ||
    document.getElementById("clearSearchBtn");

  if (searchBtn) searchBtn.addEventListener("click", performSearch);
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") performSearch();
    });
  }

  if (resetBtn) resetBtn.addEventListener("click", resetSearch);
}

function performSearch() {
  const inputEl =
    document.getElementById("searchInput") ||
    document.getElementById("commandSearch");
  const searchTerm = inputEl?.value?.toLowerCase();
  if (!searchTerm) return;

  const commandBlocks = document.querySelectorAll(".command-block");
  let found = 0;

  commandBlocks.forEach((block) => {
    const text = block.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      block.style.display = "block";
      found++;
      // Highlight matching text
      highlightText(block, searchTerm);
    } else {
      block.style.display = "none";
    }
  });

  // If a results container exists (legacy layout), populate it
  const resultsContainer =
    document.getElementById("searchResults") ||
    document.getElementById("resultsContainer");
  if (resultsContainer) {
    resultsContainer.innerHTML = `<p>Found ${found} matching command blocks.</p>`;
    resultsContainer.style.display = found ? "block" : "none";
  }

  saveSearchHistory(searchTerm);
  showMessage(`Found ${found} matching commands`, "success");
}

function resetSearch() {
  const inputEl =
    document.getElementById("searchInput") ||
    document.getElementById("commandSearch");
  if (inputEl) inputEl.value = "";

  document.querySelectorAll(".command-block").forEach((block) => {
    block.style.display = "block";
    removeHighlight(block);
  });

  const resultsContainer =
    document.getElementById("searchResults") ||
    document.getElementById("resultsContainer");
  if (resultsContainer) {
    resultsContainer.style.display = "none";
    resultsContainer.innerHTML = "";
  }

  showMessage("Search reset", "info");
}

// Backwards-compatible global alias for legacy pages
function clearSearch() {
  resetSearch();
}

function highlightText(element, searchTerm) {
  const nodes = element.querySelectorAll("code, h4, pre");
  nodes.forEach((node) => {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    node.innerHTML = node.innerHTML.replace(
      regex,
      '<mark style="background-color: yellow;">$1</mark>'
    );
  });
}

function removeHighlight(element) {
  element.querySelectorAll("mark").forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

// Copy to Clipboard - DISABLED
// function initCopyButtons() {
//   // Copy buttons functionality removed per user request
// }

function copyToClipboard(element, button) {
  // Copy functionality removed - users can select text manually
}

// Download Functions
function downloadAsFile(filename) {
  const element = document.documentElement.outerHTML;
  const blob = new Blob([element], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download.html";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  showMessage("File downloaded successfully!", "success");
}

function printPage() {
  window.print();
}

// Show/Hide Messages
function showMessage(message, type = "info") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}`;
  messageDiv.textContent = message;
  messageDiv.style.position = "fixed";
  messageDiv.style.top = "80px";
  messageDiv.style.right = "20px";
  messageDiv.style.zIndex = "1000";
  messageDiv.style.maxWidth = "400px";
  messageDiv.style.borderRadius = "5px";

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.opacity = "0";
    messageDiv.style.transition = "opacity 0.5s";
    setTimeout(() => messageDiv.remove(), 500);
  }, 3000);
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Notes (Lekha) panel and Top/Lekha button injection
function initLekha() {
  // Create Lekha button
  if (!document.getElementById("lekhaBtn")) {
    const lekhaBtn = document.createElement("button");
    lekhaBtn.id = "lekhaBtn";
    lekhaBtn.className = "lekha-btn";
    lekhaBtn.title = "Lekha (Notes)";
    lekhaBtn.textContent = "Lekha";
    document.body.appendChild(lekhaBtn);

    // Create Back to Top button if not present
    if (!document.getElementById("backToTopBtn")) {
      const topBtn = document.createElement("button");
      topBtn.id = "backToTopBtn";
      topBtn.className = "back-to-top";
      topBtn.title = "Back to Top";
      topBtn.textContent = "TOP";
      document.body.appendChild(topBtn);
    }

    // Create notes panel
    const panel = document.createElement("div");
    panel.id = "lekhaPanel";
    panel.className = "lekha-panel";
    panel.innerHTML = `
      <div class="lekha-header">
        <strong>Lekha (Notes)</strong>
        <button id="lekhaClose" class="lekha-close">×</button>
      </div>
      <textarea id="lekhaText" placeholder="Write your notes here..."></textarea>
      <div class="lekha-actions">
        <button id="lekhaSave" class="lekha-save">Save</button>
        <button id="lekhaClear" class="lekha-clear">Clear</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Event handlers
    lekhaBtn.addEventListener("click", () => {
      panel.style.display = "flex";
      document.getElementById("lekhaText").focus();
    });
    document.getElementById("lekhaClose").addEventListener("click", () => {
      panel.style.display = "none";
    });
    document.getElementById("lekhaSave").addEventListener("click", () => {
      const txt = document.getElementById("lekhaText").value;
      localStorage.setItem("lekha_notes_" + location.pathname, txt);
      showMessage("Notes saved", "success");
    });
    document.getElementById("lekhaClear").addEventListener("click", () => {
      document.getElementById("lekhaText").value = "";
      localStorage.removeItem("lekha_notes_" + location.pathname);
      showMessage("Notes cleared", "warning");
    });

    // Load saved notes
    const saved = localStorage.getItem("lekha_notes_" + location.pathname);
    if (saved) document.getElementById("lekhaText").value = saved;
  }
}

// Table of Contents Generation
function generateTableOfContents() {
  const headings = document.querySelectorAll("h2[id], h3[id]");
  if (headings.length === 0) return;

  let toc = '<div class="table-of-contents"><h3>Table of Contents</h3><ul>';
  headings.forEach((heading) => {
    const level = heading.tagName === "H2" ? 0 : 1;
    const indent = level * 20;
    toc += `<li style="margin-left: ${indent}px;"><a href="#${heading.id}">${heading.textContent}</a></li>`;
  });
  toc += "</ul></div>";

  const container = document.querySelector(".section-index");
  if (container) {
    container.innerHTML += toc;
  }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + Shift + F: Focus search
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyF") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
    // Ctrl/Cmd + Shift + T: Toggle theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyT") {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// Table Sorting
function makeTablesInteractive() {
  document.querySelectorAll("table").forEach((table) => {
    const headers = table.querySelectorAll("th");
    headers.forEach((header, index) => {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => sortTable(table, index));
    });
  });
}

function sortTable(table, columnIndex) {
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const isAsc = table.dataset.sortAsc === "true";

  rows.sort((a, b) => {
    const aValue = a.querySelectorAll("td")[columnIndex].textContent;
    const bValue = b.querySelectorAll("td")[columnIndex].textContent;

    if (isAsc) {
      return bValue.localeCompare(aValue);
    } else {
      return aValue.localeCompare(bValue);
    }
  });

  table.dataset.sortAsc = !isAsc;
  const tbody = table.querySelector("tbody");
  rows.forEach((row) => tbody.appendChild(row));
}

// Lazy Load Images
function lazyLoadImages() {
  if ("IntersectionObserver" in window) {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });
    images.forEach((img) => imageObserver.observe(img));
  }
}

// Initialize Everything on Page Load
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initSearch();
  // initCopyButtons(); // REMOVED - copy button disabled
  initBackToTop();
  initKeyboardShortcuts();
  makeTablesInteractive();
  lazyLoadImages();
  generateTableOfContents();
});

// Export for API calls (if needed with backend)
async function fetchCommands(filter) {
  try {
    const response = await fetch(`/api/commands?filter=${filter}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching commands:", error);
    showMessage("Error fetching data", "error");
  }
}

// Syntax Highlighting for Code Blocks
function applySyntaxHighlighting() {
  document.querySelectorAll("code").forEach((block) => {
    const text = block.textContent;
    // Simple syntax highlighting for bash
    block.innerHTML = text
      .replace(
        /^(\$|#|sudo|systemctl|docker|kubectl|ansible)/gm,
        '<span style="color: #d73a49;">$1</span>'
      )
      .replace(/(-[a-z]+)/g, '<span style="color: #6f42c1;">$1</span>');
  });
}

// Statistics Dashboard
function showStatistics() {
  const commandCount = document.querySelectorAll(".command-block").length;
  const sections = document.querySelectorAll("h2[id]").length;

  const stats = `
        <div class="info">
            <strong>📊 Page Statistics:</strong><br>
            Commands: ${commandCount} | Sections: ${sections}
        </div>
    `;

  const container = document.querySelector(".container");
  if (container && commandCount > 0) {
    container.insertAdjacentHTML("afterbegin", stats);
  }
}

// Session Storage for Search History
function saveSearchHistory(term) {
  let history = JSON.parse(sessionStorage.getItem("searchHistory") || "[]");
  if (!history.includes(term)) {
    history.push(term);
    if (history.length > 10) history.shift();
    sessionStorage.setItem("searchHistory", JSON.stringify(history));
  }
}

// Accessibility: Ensure links are keyboard navigable
function improveAccessibility() {
  document.querySelectorAll("a, button").forEach((element) => {
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
  });
}

/*
  FINAL COMMENT FORMATTER
  - Min 35 spaces before #
  - Long comments move to next line
  - Pure comments untouched
  - Auto-run on page load
*/

(function () {
  "use strict";

  const MIN_GAP = 9;
  const MAX_LINE_LENGTH = 100; // beyond this, comment goes to next line

  function formatComments() {
    document.querySelectorAll("pre code").forEach((codeBlock) => {
      const lines = codeBlock.innerText.split("\n");

      let maxCmdLen = 0;

      // Pass 1: find longest command
      lines.forEach((line) => {
        const idx = line.indexOf("#");
        if (idx > 0 && !line.trim().startsWith("#")) {
          const cmd = line.slice(0, idx).trimEnd();
          maxCmdLen = Math.max(maxCmdLen, cmd.length);
        }
      });

      const baseColumn = Math.max(maxCmdLen + 2, MIN_GAP);
      const result = [];

      // Pass 2: format
      lines.forEach((line) => {
        const idx = line.indexOf("#");

        // untouched cases
        if (idx === -1 || line.trim().startsWith("#")) {
          result.push(line);
          return;
        }

        const cmd = line.slice(0, idx).trimEnd();
        const commentText = line.slice(idx).trim();

        const paddedLine =
          cmd + " ".repeat(Math.max(2, baseColumn - cmd.length)) + commentText;

        // If too long → move comment to next line
        if (paddedLine.length > MAX_LINE_LENGTH) {
          result.push(cmd);
          result.push("# " + commentText.replace(/^#\s*/, ""));
        } else {
          result.push(paddedLine);
        }
      });

      codeBlock.textContent = result.join("\n");
    });
  }

  // Auto-run on page load
  window.addEventListener("DOMContentLoaded", formatComments);
})();

// Initialize accessibility on load
window.addEventListener("load", improveAccessibility);
