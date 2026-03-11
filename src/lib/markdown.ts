// src/lib/markdown.ts
// Simple markdown parser — no external deps

export function parseMarkdown(md: string): string {
  if (!md) return "";

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Fenced code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_: string, lang: string, code: string) =>
    `<pre><code class="lang-${lang}">${code.trimEnd()}</code></pre>`
  );

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Blockquote (after &gt; replacement)
  html = html.replace(/^&gt;\s(.+)$/gm, "<blockquote>$1</blockquote>");

  // HR
  html = html.replace(/^---+$/gm, "<hr />");

  // Images before links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Unordered lists
  html = html.replace(/^[ \t]*[-*+]\s+(.+)$/gm, "<li>$1</li>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Tables
  const tableRegex = /^(\|.+\|\n)([ \t]*\|[-: ]+\|[-| :\t]*\n)((?:\|.+\|\n?)*)/gm;
  html = html.replace(tableRegex, (_, header, _sep, body) => {
    const heads = header.trim().slice(1, -1).split("|").map((c: string) => c.trim());
    const rows = body.trim().split("\n").filter(Boolean);
    const thRow = heads.map((h: string) => `<th>${h}</th>`).join("");
    const tbodyRows = rows
      .map((row: string) => {
        const cells = row.trim().slice(1, -1).split("|").map((c: string) => c.trim());
        return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
      })
      .join("");
    return `<table><thead><tr>${thRow}</tr></thead><tbody>${tbodyRows}</tbody></table>`;
  });

  // Paragraphs — lines not already wrapped
  html = html
    .split("\n")
    .map((line) => {
      if (
        !line.trim() ||
        /^<(h[1-6]|ul|ol|li|pre|blockquote|table|hr|img)/.test(line)
      )
        return line;
      return `<p>${line}</p>`;
    })
    .join("\n");

  return html;
}
