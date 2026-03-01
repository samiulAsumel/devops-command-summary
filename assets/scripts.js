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
   * Create TOC items from headings
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
    Utils,
  };
}
