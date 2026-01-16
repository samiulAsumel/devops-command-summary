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

// Back to Top Button
function initBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Comment Formatter - Fixed version
function formatComments() {
  document.querySelectorAll("pre code").forEach((codeBlock) => {
    let text = codeBlock.innerText;
    
    // Remove all leading spaces from all lines first
    let lines = text.split("\n");
    lines = lines.map(line => line.replace(/^\s+/, ""));
    
    // Find the longest command length for proper alignment
    let maxCmdLen = 0;
    lines.forEach(line => {
      const idx = line.indexOf("#");
      if (idx > 0 && !line.trim().startsWith("#")) {
        const cmd = line.slice(0, idx).trimEnd();
        maxCmdLen = Math.max(maxCmdLen, cmd.length);
      }
    });
    
    // Format each line
    const MIN_GAP = 13;
    const MAX_LINE_LENGTH = 113;
    const baseColumn = Math.max(maxCmdLen + 2, MIN_GAP);
    const result = [];
    
    lines.forEach(line => {
      const idx = line.indexOf("#");
      
      // Skip pure comments and lines without comments
      if (idx === -1 || line.trim().startsWith("#")) {
        result.push(line);
        return;
      }
      
      const cmd = line.slice(0, idx).trimEnd();
      const commentText = line.slice(idx).replace(/^#\s*/, "# "); // Ensure single space after #
      
      // Calculate proper spacing
      const spacesNeeded = Math.max(2, baseColumn - cmd.length);
      const paddedLine = cmd + " ".repeat(spacesNeeded) + commentText;
      
      // If too long, move comment to next line
      if (paddedLine.length > MAX_LINE_LENGTH) {
        result.push(cmd);
        result.push("# " + commentText.slice(2)); // Remove # and add it back properly
      } else {
        result.push(paddedLine);
      }
    });
    
    codeBlock.innerText = result.join("\n");
  });
}

// Clean Code Blocks - Remove leading spaces
function cleanCodeBlocks() {
  document.querySelectorAll("pre code").forEach((block) => {
    const lines = block.innerText.split("\n");
    const cleanedLines = lines.map((line) => line.replace(/^\s+/, ""));
    block.innerText = cleanedLines.join("\n");
  });
}

// Accessibility Improvements
function improveAccessibility() {
  // Add ARIA labels to command blocks
  document.querySelectorAll(".command-block pre").forEach((block) => {
    if (!block.getAttribute("aria-label")) {
      block.setAttribute("aria-label", "Command block with code examples");
    }
  });

  // Add keyboard navigation
  document.querySelectorAll("a[href]").forEach((link) => {
    if (!link.getAttribute("role")) {
      link.setAttribute("role", "navigation");
    }
  });
}

// Table of Contents Generator
function generateTOC() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  
  const headings = document.querySelectorAll('h2, h3');
  const tocItems = [];
  
  headings.forEach((heading, index) => {
    if (heading.id) {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent.trim();
      
      const li = document.createElement('li');
      li.className = `toc-level-${level}`;
      
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = title;
      
      li.appendChild(a);
      tocItems.push(li);
    }
  });
  
  tocList.innerHTML = '';
  tocItems.forEach(item => tocList.appendChild(item));
}

// Initialize everything on page load
window.addEventListener("DOMContentLoaded", function () {
  initDarkMode();
  initBackToTop();
  formatComments();
  cleanCodeBlocks();
  generateTOC();
});

// Initialize accessibility on load
window.addEventListener("load", improveAccessibility);
