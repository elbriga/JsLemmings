// diff-component.js
// Requires jsdiff library (https://github.com/kpdecker/jsdiff) to be loaded globally.

(function (global) {
  // Check if jsdiff is present
  if (typeof Diff === "undefined") {
    console.error(
      'diff-component.js requires the "jsdiff" library. Please include <script src="https://cdn.jsdelivr.net/npm/diff@5.2.0/dist/diff.min.js"></script>',
    );
  }

  // Helper: escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Helper: extract file name from URL
  function getFileName(url) {
    try {
      const path = new URL(url).pathname;
      let name = path.split("/").pop();
      if (!name) name = "document";
      return decodeURIComponent(name).substring(0, 30);
    } catch (e) {
      return "remote file";
    }
  }

  // Core diff rendering (pairing removed/added blocks)
  function renderDiffInto(
    leftContainer,
    rightContainer,
    leftText,
    rightText,
    leftName,
    rightName,
  ) {
    const changes = Diff.diffLines(leftText || "", rightText || "");
    const leftRows = [];
    const rightRows = [];

    for (let i = 0; i < changes.length; i++) {
      const part = changes[i];
      if (part.removed) {
        let removedLines = part.value.split(/\r?\n/);
        if (removedLines[removedLines.length - 1] === "") removedLines.pop();
        let addedLines = [];
        let hasPairedAdd = false;
        if (i + 1 < changes.length && changes[i + 1].added) {
          addedLines = changes[i + 1].value.split(/\r?\n/);
          if (addedLines[addedLines.length - 1] === "") addedLines.pop();
          hasPairedAdd = true;
          i++;
        }
        const maxLen = Math.max(removedLines.length, addedLines.length);
        for (let j = 0; j < maxLen; j++) {
          leftRows.push({
            text: j < removedLines.length ? removedLines[j] : "",
            type: "removed",
          });
          rightRows.push({
            text: j < addedLines.length ? addedLines[j] : "",
            type: "added",
          });
        }
      } else if (part.added) {
        let addedLines = part.value.split(/\r?\n/);
        if (addedLines[addedLines.length - 1] === "") addedLines.pop();
        for (let line of addedLines) {
          leftRows.push({ text: "", type: "empty" });
          rightRows.push({ text: line, type: "added" });
        }
      } else {
        let unchangedLines = part.value.split(/\r?\n/);
        if (unchangedLines[unchangedLines.length - 1] === "")
          unchangedLines.pop();
        for (let line of unchangedLines) {
          leftRows.push({ text: line, type: "unchanged" });
          rightRows.push({ text: line, type: "unchanged" });
        }
      }
    }

    function renderPanel(rows, container) {
      if (!rows.length) {
        container.innerHTML =
          '<div class="placeholder-info">No lines to display</div>';
        return;
      }
      const html = rows
        .map((row, idx) => {
          const content = escapeHtml(row.text);
          let lineClass = "";
          if (row.type === "removed") lineClass = "line-removed";
          else if (row.type === "added") lineClass = "line-added";
          else if (row.type === "empty") lineClass = "line-empty";
          else lineClass = "line-unchanged";
          const displayContent =
            row.type === "empty" && row.text === ""
              ? '<span style="opacity:0.5;">␣</span>'
              : content;
          return `<div class="line-row ${lineClass}">
                  <div class="line-number">${idx + 1}</div>
                  <div class="line-content">${displayContent || " "}</div>
                </div>`;
        })
        .join("");
      container.innerHTML = `<div class="diff-lines">${html}</div>`;
    }

    renderPanel(leftRows, leftContainer);
    renderPanel(rightRows, rightContainer);
    // Update badges
    const leftBadge = leftContainer
      .closest(".panel")
      .querySelector(".file-badge");
    const rightBadge = rightContainer
      .closest(".panel")
      .querySelector(".file-badge");
    if (leftBadge) leftBadge.innerText = leftName;
    if (rightBadge) rightBadge.innerText = rightName;
  }

  // Main class for a single diff viewer
  class DiffViewer {
    constructor(leftUrl, rightUrl) {
      this.leftUrl = leftUrl;
      this.rightUrl = rightUrl;
      this.element = null;
      this.leftContainer = null;
      this.rightContainer = null;
      this.leftScrollHandler = null;
      this.rightScrollHandler = null;
      this.scrollLock = false;
    }

    // Build the DOM structure
    build() {
      const container = document.createElement("div");
      container.className = "diff-viewer";

      // unique ID for internal use (optional)
      const uid = "dv_" + Math.random().toString(36).substr(2, 8);

      container.innerHTML = `
        <div class="toolbar">
          <div style="display: flex; gap: 12px;">
            <span class="file-badge">${escapeHtml(getFileName(this.leftUrl))}</span>
            <span style="color: #94a3b8;">⇄</span>
            <span class="file-badge">${escapeHtml(getFileName(this.rightUrl))}</span>
          </div>
          <button class="refresh-btn" data-refresh>⟳ Refresh</button>
        </div>
        <div class="panels">
          <div class="panel">
            <div class="panel-header">
              <span>📄 LEFT</span>
              <span class="file-badge" style="background:#f1f5f9;">${escapeHtml(getFileName(this.leftUrl))}</span>
            </div>
            <div class="diff-container" data-left-scroll></div>
          </div>
          <div class="panel">
            <div class="panel-header">
              <span>📄 RIGHT</span>
              <span class="file-badge" style="background:#f1f5f9;">${escapeHtml(getFileName(this.rightUrl))}</span>
            </div>
            <div class="diff-container" data-right-scroll></div>
          </div>
        </div>
      `;

      this.element = container;
      this.leftContainer = container.querySelector("[data-left-scroll]");
      this.rightContainer = container.querySelector("[data-right-scroll]");

      // Attach scroll sync
      this._attachScrollSync();

      // Attach refresh button
      const refreshBtn = container.querySelector("[data-refresh]");
      refreshBtn.addEventListener("click", () => this.fetchAndRender());

      // Start fetching
      this.fetchAndRender();
      return container;
    }

    _attachScrollSync() {
      if (!this.leftContainer || !this.rightContainer) return;

      const left = this.leftContainer;
      const right = this.rightContainer;

      const leftHandler = () => {
        if (this.scrollLock) return;
        this.scrollLock = true;
        right.scrollTop = left.scrollTop;
        requestAnimationFrame(() => {
          this.scrollLock = false;
        });
      };
      const rightHandler = () => {
        if (this.scrollLock) return;
        this.scrollLock = true;
        left.scrollTop = right.scrollTop;
        requestAnimationFrame(() => {
          this.scrollLock = false;
        });
      };

      left.addEventListener("scroll", leftHandler);
      right.addEventListener("scroll", rightHandler);
      this.leftScrollHandler = leftHandler;
      this.rightScrollHandler = rightHandler;
    }

    _detachScrollSync() {
      if (this.leftScrollHandler && this.leftContainer) {
        this.leftContainer.removeEventListener(
          "scroll",
          this.leftScrollHandler,
        );
      }
      if (this.rightScrollHandler && this.rightContainer) {
        this.rightContainer.removeEventListener(
          "scroll",
          this.rightScrollHandler,
        );
      }
    }

    async fetchAndRender() {
      this._setLoadingState();

      try {
        const [leftResp, rightResp] = await Promise.all([
          fetch(this.leftUrl),
          fetch(this.rightUrl),
        ]);
        if (!leftResp.ok)
          throw new Error(
            `Left file: ${leftResp.status} ${leftResp.statusText}`,
          );
        if (!rightResp.ok)
          throw new Error(
            `Right file: ${rightResp.status} ${rightResp.statusText}`,
          );

        const leftText = await leftResp.text();
        const rightText = await rightResp.text();

        renderDiffInto(
          this.leftContainer,
          this.rightContainer,
          leftText,
          rightText,
          getFileName(this.leftUrl),
          getFileName(this.rightUrl),
        );
      } catch (err) {
        this._showError(err.message);
      }
    }

    _setLoadingState() {
      this.leftContainer.innerHTML =
        '<div class="placeholder-info"><span class="spinner"></span> Loading left file...</div>';
      this.rightContainer.innerHTML =
        '<div class="placeholder-info"><span class="spinner"></span> Loading right file...</div>';
    }

    _showError(msg) {
      const errorHtml = `<div class="error-message">⚠️ ${escapeHtml(msg)}</div>`;
      this.leftContainer.innerHTML = errorHtml;
      this.rightContainer.innerHTML = errorHtml;
    }

    // Optional cleanup
    destroy() {
      this._detachScrollSync();
      if (this.element) this.element.remove();
    }
  }

  // The public function
  global.diff = function (fileName1, fileName2) {
    const viewer = new DiffViewer(fileName1, fileName2);
    const div = viewer.build();
    // Store reference for potential cleanup (optional)
    div._diffViewer = viewer;
    return div;
  };
})(window);
