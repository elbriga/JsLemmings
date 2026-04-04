class Diff {
  static async diff(file1, file2) {
    const [text1, text2] = await Promise.all([
      fetch(file1).then((r) => r.text()),
      fetch(file2).then((r) => r.text()),
    ]);

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");

    const aligned = this.align(lines1, lines2);

    return this.render(file1, file2, aligned);
  }

  // --- NORMALIZATION (key part) ---
  static normalize(line) {
    return line
      .replace(/def\s+/g, "")
      .replace(/self\./g, "")
      .replace(/this\./g, "")
      .replace(/\(\s*\)/g, "()")
      .replace(/:\s*$/, "")
      .replace(/\{\s*$/, "")
      .replace(/\s+/g, "")
      .trim();
  }

  static compare(a, b) {
    if (a === b) return "match";

    const na = this.normalize(a);
    const nb = this.normalize(b);

    if (na === nb) return "similar";

    return "diff";
  }

  // --- ALIGNMENT ---
  static align(a, b) {
    const max = Math.max(a.length, b.length);
    const result = [];

    let i = 0,
      j = 0;

    while (i < a.length || j < b.length) {
      const lineA = a[i] ?? "";
      const lineB = b[j] ?? "";

      const type = this.compare(lineA, lineB);

      if (type !== "diff") {
        result.push([lineA, lineB, type]);
        i++;
        j++;
      } else {
        // lookahead (simple sync)
        if (this.compare(a[i + 1] || "", lineB) !== "diff") {
          result.push([lineA, "", "diff"]);
          i++;
        } else if (this.compare(lineA, b[j + 1] || "") !== "diff") {
          result.push(["", lineB, "diff"]);
          j++;
        } else {
          result.push([lineA, lineB, "diff"]);
          i++;
          j++;
        }
      }
    }

    return result;
  }

  // --- RENDER ---
  static render(name1, name2, lines) {
    const container = document.createElement("div");
    container.className = "diff-container";

    const box = document.createElement("div");
    box.className = "diff-box";

    const header = document.createElement("div");
    header.className = "diff-header";
    header.textContent = `${name1}  ↔  ${name2}`;

    const content = document.createElement("div");
    content.className = "diff-content";

    const col1 = document.createElement("div");
    const col2 = document.createElement("div");
    col1.className = "diff-column";
    col2.className = "diff-column";

    lines.forEach(([l1, l2, type], idx) => {
      col1.appendChild(this.createLine(l1, idx + 1, type));
      col2.appendChild(this.createLine(l2, idx + 1, type));
    });

    // LINKED SCROLL
    col1.addEventListener("scroll", () => {
      col2.scrollTop = col1.scrollTop;
    });
    col2.addEventListener("scroll", () => {
      col1.scrollTop = col2.scrollTop;
    });

    content.appendChild(col1);
    content.appendChild(col2);

    box.appendChild(header);
    box.appendChild(content);
    container.appendChild(box);

    return container;
  }

  static createLine(text, number, type) {
    const line = document.createElement("div");
    line.className = `line ${type}`;

    const num = document.createElement("div");
    num.className = "line-number";
    num.textContent = text ? number : "";

    const code = document.createElement("div");
    code.textContent = text;

    line.appendChild(num);
    line.appendChild(code);

    return line;
  }
}
