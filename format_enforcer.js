// Perfect Format JavaScript for devops-command-summary
// This script ensures consistent formatting across all HTML files

function applyPerfectFormat() {
  const codeBlocks = document.querySelectorAll("pre code");
  let blocksProcessed = 0;
  let linesFixed = 0;

  codeBlocks.forEach((block) => {
    const lines = block.textContent.split("\n");
    const processedLines = [];

    lines.forEach((line) => {
      if (line.trim().startsWith("#")) {
        // Comment line
        const lineLower = line.toLowerCase();
        const majorKeywords = [
          "enterprise",
          "compatible with:",
          "python",
          "docker",
          "kubernetes",
          "git",
          "basic",
          "advanced",
          "monitoring",
          "security",
          "networking",
          "package management",
          "file operations",
          "process management",
          "system information",
          "backup",
          "automation",
          "shell scripting",
          "container",
          "image",
          "network",
          "volume",
          "service",
          "deployment",
          "configuration",
          "logging",
          "troubleshooting",
        ];

        // Add blank line before major sections
        if (majorKeywords.some((keyword) => lineLower.includes(keyword))) {
          if (
            processedLines.length > 0 &&
            processedLines[processedLines.length - 1].trim() !== ""
          ) {
            processedLines.push("");
          }
        }

        processedLines.push(line.trim());
      } else if (line.includes("#") && !line.trim().startsWith("#")) {
        // Command line with comment
        const parts = line.split("#", 2);
        if (parts.length === 2) {
          const cmdPart = parts[0].trimEnd();
          const commentPart = parts[1];
          const newLine = cmdPart + " #" + commentPart;
          processedLines.push(newLine.trim());
          linesFixed++;
        } else {
          processedLines.push(line.trim());
        }
      } else {
        // Regular line
        if (line.trim()) {
          processedLines.push(line.trim());
        }
      }
    });

    // Remove double blank lines
    const finalLines = [];
    processedLines.forEach((line, i) => {
      if (line.trim() === "") {
        if (i === 0 || processedLines[i - 1].trim() !== "") {
          finalLines.push(line);
        }
      } else {
        finalLines.push(line);
      }
    });

    // Update the block
    block.textContent = finalLines.join("\n");
    blocksProcessed++;
  });
}

// Auto-apply on page load
document.addEventListener("DOMContentLoaded", applyPerfectFormat);

// Also add to window for manual execution
window.applyPerfectFormat = applyPerfectFormat;
