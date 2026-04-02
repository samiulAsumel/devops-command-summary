/**
 * Enterprise-Grade JavaScript Module
 * Features: ES6+ syntax, comprehensive error handling, performance optimization
 * Compatible with: Modern browsers (ES6+), enterprise environments
 */

// Configuration constants
const CONFIG = {
  THEME_STORAGE_KEY: "theme",
  SCROLL_THRESHOLD: 300,
  DEBOUNCE_DELAY: 100,
  MAX_LINE_LENGTH: 113,
  MIN_GAP: 13,
  NAVIGATION_THRESHOLD: 100,
};

// Utility functions
const Utils = {
  /**
   * Safe localStorage operations with error handling
   * @param {string} key - Storage key
   * @param {string} defaultValue - Default value if key doesn't exist
   * @returns {string|null} Stored value or default
   */
  safeStorageGet: (key, defaultValue = null) => {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${error.message}`);
      return defaultValue;
    }
  },

  /**
   * Safe localStorage set with error handling
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  safeStorageSet: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to write to localStorage: ${error.message}`);
      return false;
    }
  },

  /**
   * Debounce function for performance optimization
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Safe DOM query with error handling
   * @param {string} selector - CSS selector
   * @returns {Element|null} DOM element or null
   */
  safeQuery: (selector) => {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Invalid selector: ${selector} - ${error.message}`);
      return null;
    }
  },
};

// Theme Management Module
const ThemeManager = {
  /**
   * Initialize theme system with enterprise error handling
   */
  init() {
    try {
      const theme = Utils.safeStorageGet(CONFIG.THEME_STORAGE_KEY, "light");
      if (theme === "dark") {
        document.body.classList.add("dark-mode");
      }

      const themeToggle = Utils.safeQuery("#themeToggle");
      if (themeToggle) {
        themeToggle.addEventListener("click", this.toggle.bind(this));
      }
    } catch (error) {
      console.error("Theme initialization failed:", error);
    }
  },

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    try {
      document.body.classList.toggle("dark-mode");
      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";
      Utils.safeStorageSet(CONFIG.THEME_STORAGE_KEY, theme);

      // Dispatch custom event for theme change
      window.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme } }),
      );
    } catch (error) {
      console.error("Theme toggle failed:", error);
    }
  },
};

// Scroll Management Module
const ScrollManager = {
  /**
   * Initialize back-to-top functionality with performance optimization
   */
  initBackToTop() {
    try {
      const btn = Utils.safeQuery("#backToTopBtn");
      if (!btn) return;

      // Use debounced scroll handler for performance
      const debouncedScrollHandler = Utils.debounce(
        this.handleScroll.bind(this),
        CONFIG.DEBOUNCE_DELAY,
      );
      window.addEventListener("scroll", debouncedScrollHandler, {
        passive: true,
      });

      btn.addEventListener("click", this.scrollToTop.bind(this));
    } catch (error) {
      console.error("Back-to-top initialization failed:", error);
    }
  },

  /**
   * Handle scroll events with performance optimization
   */
  handleScroll() {
    try {
      const btn = Utils.safeQuery("#backToTopBtn");
      if (!btn) return;

      const shouldShow = window.pageYOffset > CONFIG.SCROLL_THRESHOLD;
      btn.style.display = shouldShow ? "flex" : "none";
    } catch (error) {
      console.error("Scroll handler failed:", error);
    }
  },

  /**
   * Smooth scroll to top with error handling
   */
  scrollToTop() {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, 0);
      console.warn("Smooth scrolling not supported, using instant scroll");
    }
  },
};

// Code Formatting Module
const CodeFormatter = {
  /**
   * Format code comments with enterprise-grade alignment
   */
  formatComments() {
    try {
      document.querySelectorAll("pre code").forEach((codeBlock) => {
        this.formatCodeBlock(codeBlock);
      });
    } catch (error) {
      console.error("Comment formatting failed:", error);
    }
  },

  /**
   * Format individual code block
   * @param {Element} codeBlock - The code block element to format
   */
  formatCodeBlock(codeBlock) {
    try {
      let text = codeBlock.innerText;

      // Remove all leading spaces from all lines first
      let lines = text.split("\n");
      lines = lines.map((line) => line.replace(/^\s+/, ""));

      // Find longest command length for proper alignment
      let maxCmdLen = 0;
      lines.forEach((line) => {
        const idx = line.indexOf("#");
        if (idx > 0 && !line.trim().startsWith("#")) {
          const cmd = line.slice(0, idx).trimEnd();
          maxCmdLen = Math.max(maxCmdLen, cmd.length);
        }
      });

      // Format each line with enterprise standards
      const baseColumn = Math.max(maxCmdLen + 2, CONFIG.MIN_GAP);
      const result = this.formatLines(lines, baseColumn);

      codeBlock.innerText = result.join("\n");
    } catch (error) {
      console.error("Code block formatting failed:", error);
    }
  },

  /**
   * Format array of lines with proper comment alignment
   * @param {Array} lines - Array of code lines
   * @param {number} baseColumn - Base column for comment alignment
   * @returns {Array} Formatted lines
   */
  formatLines(lines, baseColumn) {
    const result = [];

    lines.forEach((line) => {
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
      if (paddedLine.length > CONFIG.MAX_LINE_LENGTH) {
        result.push(cmd);
        result.push("# " + commentText.slice(2)); // Remove # and add it back properly
      } else {
        result.push(paddedLine);
      }
    });

    return result;
  },

  /**
   * Clean code blocks by removing leading spaces
   */
  cleanCodeBlocks() {
    try {
      document.querySelectorAll("pre code").forEach((block) => {
        const lines = block.innerText.split("\n");
        const cleanedLines = lines.map((line) => line.replace(/^\s+/, ""));
        block.innerText = cleanedLines.join("\n");
      });
    } catch (error) {
      console.error("Code block cleaning failed:", error);
    }
  },
};

// Accessibility Module
const Accessibility = {
  /**
   * Improve accessibility with enterprise standards
   */
  improve() {
    try {
      this.addAriaLabels();
      this.enhanceKeyboardNavigation();
      this.addFocusManagement();
    } catch (error) {
      console.error("Accessibility improvements failed:", error);
    }
  },

  /**
   * Add ARIA labels to interactive elements
   */
  addAriaLabels() {
    // Add ARIA labels to command blocks
    document.querySelectorAll(".command-block pre").forEach((block) => {
      if (!block.getAttribute("aria-label")) {
        block.setAttribute("aria-label", "Command block with code examples");
      }
    });
  },

  /**
   * Enhance keyboard navigation
   */
  enhanceKeyboardNavigation() {
    document.querySelectorAll("a[href]").forEach((link) => {
      if (!link.getAttribute("role")) {
        link.setAttribute("role", "navigation");
      }
    });
  },

  /**
   * Add focus management for better accessibility
   */
  addFocusManagement() {
    // Add skip link functionality
    const skipLink = Utils.safeQuery(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("focus", () => {
        skipLink.style.outline = "2px solid var(--secondary-color)";
      });

      skipLink.addEventListener("blur", () => {
        skipLink.style.outline = "none";
      });
    }
  },
};

// Table of Contents Module
const TOCGenerator = {
  /**
   * Generate table of contents with enterprise features
   */
  generate() {
    try {
      const tocList = Utils.safeQuery("#toc-list");
      if (!tocList) return;

      const headings = document.querySelectorAll("h2, h3");
      const tocItems = this.createTOCItems(headings);

      this.renderTOC(tocList, tocItems);
    } catch (error) {
      console.error("TOC generation failed:", error);
    }
  },

  /**
   * Create TOC items from headings with progress checkboxes
   * @param {NodeList} headings - Headings to convert
   * @returns {Array} Array of TOC list items
   */
  createTOCItems(headings) {
    const tocItems = [];

    headings.forEach((heading, index) => {
      if (heading.id) {
        const level = parseInt(heading.tagName.charAt(1));
        const title = heading.textContent.trim();

        const li = document.createElement("li");
        li.className = `toc-level-${level}`;

        if (level === 2) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "toc-checkbox";
          checkbox.setAttribute("data-section", heading.id);
          checkbox.setAttribute("aria-label", `Mark ${title} as completed`);
          li.appendChild(checkbox);
        }

        const a = document.createElement("a");
        a.href = `#${heading.id}`;
        a.textContent = title;
        a.setAttribute("aria-label", `Navigate to ${title}`);

        li.appendChild(a);
        tocItems.push(li);
      }
    });

    return tocItems;
  },

  /**
   * Render TOC items to the list
   * @param {Element} tocList - TOC list element
   * @param {Array} tocItems - TOC items to render
   */
  renderTOC(tocList, tocItems) {
    tocList.innerHTML = "";
    tocItems.forEach((item) => tocList.appendChild(item));
  },
};

// Navigation Module
const NavigationManager = {
  /**
   * Initialize navigation buttons with enterprise features
   */
  init() {
    try {
      this.createNavigationButtons();
      this.bindNavigationEvents();
      this.initScrollHandler();
    } catch (error) {
      console.error("Navigation initialization failed:", error);
    }
  },

  /**
   * Create navigation buttons with proper accessibility
   */
  createNavigationButtons() {
    const navContainer = document.createElement("div");
    navContainer.className = "navigation-buttons";
    navContainer.setAttribute("role", "navigation");
    navContainer.setAttribute("aria-label", "Page navigation");

    navContainer.innerHTML = `
      <button id="navUpBtn" class="nav-btn nav-up" aria-label="Navigate to top of page">
        ↑
      </button>
      <button id="navDownBtn" class="nav-btn nav-down" aria-label="Navigate to bottom of page">
        ↓
      </button>
    `;

    document.body.appendChild(navContainer);
  },

  /**
   * Bind events to navigation buttons
   */
  bindNavigationEvents() {
    const upBtn = Utils.safeQuery("#navUpBtn");
    const downBtn = Utils.safeQuery("#navDownBtn");

    if (!upBtn || !downBtn) return;

    // Up button - Go to top of page
    upBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      ScrollManager.scrollToTop();
    });

    // Down button - Go to bottom of page
    downBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.scrollToBottom();
    });
  },

  /**
   * Initialize scroll handler with performance optimization
   */
  initScrollHandler() {
    const debouncedScrollHandler = Utils.debounce(
      this.handleScroll.bind(this),
      CONFIG.DEBOUNCE_DELAY,
    );
    window.addEventListener("scroll", debouncedScrollHandler, {
      passive: true,
    });
  },

  /**
   * Handle scroll events for navigation buttons
   */
  handleScroll() {
    try {
      const upBtn = Utils.safeQuery("#navUpBtn");
      const downBtn = Utils.safeQuery("#navDownBtn");

      if (!upBtn || !downBtn) return;

      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const isAtTop = scrollTop <= CONFIG.NAVIGATION_THRESHOLD;
      const isAtBottom =
        scrollTop >=
        documentHeight - windowHeight - CONFIG.NAVIGATION_THRESHOLD;

      // Hide/show buttons based on scroll position
      upBtn.style.display = isAtTop ? "none" : "flex";
      downBtn.style.display = isAtBottom ? "none" : "flex";
    } catch (error) {
      console.error("Navigation scroll handler failed:", error);
    }
  },

  /**
   * Scroll to bottom of page with error handling
   */
  scrollToBottom() {
    try {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: maxScroll,
        behavior: "smooth",
      });
    } catch (error) {
      // Fallback for browsers that don't support smooth scrolling
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, maxScroll);
      console.warn("Smooth scrolling not supported, using instant scroll");
    }
  },
};

// Search Module
const SearchManager = {
  sections: [],

  init() {
    try {
      this.buildIndex();
      this.bindEvents();
    } catch (error) {
      console.error("Search initialization failed:", error);
    }
  },

  buildIndex() {
    const headings = document.querySelectorAll("h2[id], h3[id]");
    this.sections = [];

    headings.forEach((heading) => {
      const id = heading.id;
      const title = heading.textContent.trim();
      let content = "";

      let sibling = heading.nextElementSibling;
      while (sibling && !sibling.matches("h2, h3")) {
        content += sibling.textContent + " ";
        sibling = sibling.nextElementSibling;
      }

      this.sections.push({
        id: id,
        title: title,
        content: content.trim().toLowerCase(),
        titleLower: title.toLowerCase(),
      });
    });
  },

  bindEvents() {
    const searchInput = Utils.safeQuery("#searchInput");
    const clearBtn = Utils.safeQuery("#searchClearBtn");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        Utils.debounce(() => this.performSearch(), 200)
      );
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearSearch());
    }
  },

  performSearch() {
    const searchInput = Utils.safeQuery("#searchInput");
    const resultsContainer = Utils.safeQuery("#searchResultsContainer");
    const clearBtn = Utils.safeQuery("#searchClearBtn");

    if (!searchInput || !resultsContainer) return;

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      resultsContainer.classList.remove("visible");
      if (clearBtn) clearBtn.classList.remove("visible");
      return;
    }

    if (clearBtn) clearBtn.classList.add("visible");

    const results = this.sections
      .filter((section) => {
        return (
          section.titleLower.includes(query) ||
          section.content.includes(query)
        );
      })
      .slice(0, 20);

    this.renderResults(results, query);
  },

  renderResults(results, query) {
    const resultsContainer = Utils.safeQuery("#searchResultsContainer");
    if (!resultsContainer) return;

    resultsContainer.classList.add("visible");

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">🔍</div>
          <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
        </div>
      `;
      return;
    }

    let html = `<div class="search-result-count">${results.length} result${results.length > 1 ? "s" : ""} found</div>`;

    results.forEach((result) => {
      let context = "";
      const idx = result.content.indexOf(query);
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(result.content.length, idx + query.length + 60);
        context =
          (start > 0 ? "..." : "") +
          result.content.slice(start, end).replace(
            new RegExp(`(${this.escapeRegex(query)})`, "gi"),
            "<mark>$1</mark>"
          ) +
          (end < result.content.length ? "..." : "");
      }

      html += `
        <div class="search-result-item" onclick="SearchManager.jumpToSection('${result.id}')">
          <div class="result-section">${this.escapeHtml(result.title)}</div>
          ${context ? `<div class="result-context">${context}</div>` : ""}
        </div>
      `;
    });

    resultsContainer.innerHTML = html;
  },

  jumpToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.classList.add("section-flash");
      setTimeout(() => element.classList.remove("section-flash"), 1000);
    }
  },

  clearSearch() {
    const searchInput = Utils.safeQuery("#searchInput");
    const resultsContainer = Utils.safeQuery("#searchResultsContainer");
    const clearBtn = Utils.safeQuery("#searchClearBtn");

    if (searchInput) searchInput.value = "";
    if (resultsContainer) resultsContainer.classList.remove("visible");
    if (clearBtn) clearBtn.classList.remove("visible");
  },

  escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },
};

// Progress Tracking Module
const ProgressTracker = {
  storageKey: "learning-progress",

  init() {
    try {
      this.loadProgress();
      this.bindEvents();
      this.updateProgressBar();
    } catch (error) {
      console.error("Progress tracker initialization failed:", error);
    }
  },

  getProgress() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveProgress(progress) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    } catch (error) {
      console.warn("Failed to save progress:", error);
    }
  },

  getPageKey() {
    return window.location.pathname.split("/").pop() || "index.html";
  },

  loadProgress() {
    const progress = this.getProgress();
    const pageKey = this.getPageKey();
    const pageProgress = progress[pageKey] || {};

    document.querySelectorAll(".toc-checkbox").forEach((checkbox) => {
      const sectionId = checkbox.getAttribute("data-section");
      if (pageProgress[sectionId]) {
        checkbox.checked = true;
        const li = checkbox.closest("li");
        if (li) li.classList.add("completed");
      }
    });
  },

  bindEvents() {
    document.querySelectorAll(".toc-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const sectionId = e.target.getAttribute("data-section");
        const progress = this.getProgress();
        const pageKey = this.getPageKey();

        if (!progress[pageKey]) progress[pageKey] = {};

        if (e.target.checked) {
          progress[pageKey][sectionId] = true;
          const li = e.target.closest("li");
          if (li) li.classList.add("completed");
        } else {
          delete progress[pageKey][sectionId];
          const li = e.target.closest("li");
          if (li) li.classList.remove("completed");
        }

        this.saveProgress(progress);
        this.updateProgressBar();
      });
    });

    const resetBtn = Utils.safeQuery("#progressResetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetProgress());
    }
  },

  updateProgressBar() {
    const total = document.querySelectorAll(".toc-checkbox").length;
    const completed = document.querySelectorAll(".toc-checkbox:checked").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const fill = Utils.safeQuery("#progressBarFill");
    const text = Utils.safeQuery("#progressText");

    if (fill) fill.style.width = percentage + "%";
    if (text) text.textContent = `${completed}/${total} sections (${percentage}%)`;
  },

  resetProgress() {
    const progress = this.getProgress();
    const pageKey = this.getPageKey();
    delete progress[pageKey];
    this.saveProgress(progress);

    document.querySelectorAll(".toc-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
      const li = checkbox.closest("li");
      if (li) li.classList.remove("completed");
    });

    this.updateProgressBar();
  },
};

// Breadcrumb Module
const BreadcrumbManager = {
  init() {
    try {
      this.bindScrollHandler();
    } catch (error) {
      console.error("Breadcrumb initialization failed:", error);
    }
  },

  bindScrollHandler() {
    const debouncedHandler = Utils.debounce(
      this.updateBreadcrumb.bind(this),
      50
    );
    window.addEventListener("scroll", debouncedHandler, { passive: true });
  },

  updateBreadcrumb() {
    const breadcrumbCurrent = Utils.safeQuery("#breadcrumbCurrent");
    if (!breadcrumbCurrent) return;

    const headings = document.querySelectorAll("h2[id]");
    let currentTitle = "";

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        currentTitle = heading.textContent.trim();
      }
    });

    if (currentTitle) {
      breadcrumbCurrent.textContent = currentTitle;
    }
  },
};

// Section Navigation Module (Prev/Next)
const SectionNavManager = {
  sections: [],

  init() {
    try {
      this.buildSectionList();
      this.renderPrevNext();
      this.updatePrevNextOnScroll();
      this.bindScrollHandler();
    } catch (error) {
      console.error("Section navigation initialization failed:", error);
    }
  },

  buildSectionList() {
    this.sections = [];
    document.querySelectorAll("h2[id]").forEach((heading) => {
      this.sections.push({
        id: heading.id,
        title: heading.textContent.trim(),
      });
    });
  },

  renderPrevNext() {
    const container = Utils.safeQuery("#sectionNavContainer");
    if (!container || this.sections.length === 0) return;

    let html = "";
    this.sections.forEach((section, index) => {
      const prev = index > 0 ? this.sections[index - 1] : null;
      const next =
        index < this.sections.length - 1 ? this.sections[index + 1] : null;

      html += `<div class="section-nav" data-section-nav="${section.id}" style="display:none;">`;

      if (prev) {
        html += `
          <a href="#${prev.id}" class="section-nav-btn prev" onclick="event.preventDefault(); document.getElementById('${prev.id}').scrollIntoView({behavior:'smooth',block:'start'});">
            <span class="nav-label">← Previous</span>
            <span class="nav-title">${prev.title}</span>
          </a>
        `;
      } else {
        html += `<div class="section-nav-center"></div>`;
      }

      if (next) {
        html += `
          <a href="#${next.id}" class="section-nav-btn next" onclick="event.preventDefault(); document.getElementById('${next.id}').scrollIntoView({behavior:'smooth',block:'start'});">
            <span class="nav-label">Next →</span>
            <span class="nav-title">${next.title}</span>
          </a>
        `;
      }

      html += `</div>`;
    });

    container.innerHTML = html;
  },

  bindScrollHandler() {
    const debouncedHandler = Utils.debounce(
      this.updatePrevNextOnScroll.bind(this),
      100
    );
    window.addEventListener("scroll", debouncedHandler, { passive: true });
  },

  updatePrevNextOnScroll() {
    const navs = document.querySelectorAll("[data-section-nav]");
    let currentId = "";

    document.querySelectorAll("h2[id]").forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = heading.id;
      }
    });

    navs.forEach((nav) => {
      if (nav.getAttribute("data-section-nav") === currentId) {
        nav.style.display = "flex";
      } else {
        nav.style.display = "none";
      }
    });
  },
};

// TOC Toggle Module
const TOCToggle = {
  init() {
    try {
      const toggleBtn = Utils.safeQuery("#tocToggleBtn");
      const tocContainer = Utils.safeQuery(".section-index");

      if (toggleBtn && tocContainer) {
        toggleBtn.addEventListener("click", () => {
          tocContainer.classList.toggle("collapsed");
          toggleBtn.textContent = tocContainer.classList.contains("collapsed")
            ? "▶ Show Contents"
            : "▼ Hide Contents";
        });
      }
    } catch (error) {
      console.error("TOC toggle initialization failed:", error);
    }
  },
};

// Main Application Controller
const App = {
  /**
   * Initialize all modules with enterprise error handling
   */
  init() {
    try {
      console.log("🚀 Initializing Enterprise DevOps Command Reference...");

      // Initialize all modules
      ThemeManager.init();
      ScrollManager.initBackToTop();
      NavigationManager.init();
      CodeFormatter.formatComments();
      CodeFormatter.cleanCodeBlocks();
      TOCGenerator.generate();

      // Learning Guide modules
      SearchManager.init();
      ProgressTracker.init();
      BreadcrumbManager.init();
      SectionNavManager.init();
      TOCToggle.init();

      console.log("✅ All modules initialized successfully");
    } catch (error) {
      console.error("Application initialization failed:", error);
    }
  },

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    try {
      Accessibility.improve();
      console.log("✅ Accessibility features initialized");
    } catch (error) {
      console.error("Accessibility initialization failed:", error);
    }
  },
};

// Initialize application with proper event handling
window.addEventListener("DOMContentLoaded", App.init.bind(App));
window.addEventListener("load", App.initAccessibility.bind(App));

// Export for potential module usage (if needed in the future)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    App,
    ThemeManager,
    ScrollManager,
    CodeFormatter,
    Accessibility,
    TOCGenerator,
    NavigationManager,
    SearchManager,
    ProgressTracker,
    BreadcrumbManager,
    SectionNavManager,
    TOCToggle,
    Utils,
  };
}
