// src/lib/formatters.ts
// Guebly README to PDF — Social Formatters

type ProtectedChunk = { key: string; value: string };

function normalize(text: string) {
  return (text ?? "").replace(/\r\n?/g, "\n");
}

function protectCode(text: string) {
  const chunks: ProtectedChunk[] = [];
  let out = text;
  out = out.replace(/```[\s\S]*?```/g, (m) => {
    const key = `⟦CODEBLOCK_${chunks.length}⟧`;
    chunks.push({ key, value: m });
    return key;
  });
  out = out.replace(/`[^`\n]+`/g, (m) => {
    const key = `⟦CODE_${chunks.length}⟧`;
    chunks.push({ key, value: m });
    return key;
  });
  return { out, chunks };
}

function restoreProtected(text: string, chunks: ProtectedChunk[]) {
  let out = text;
  for (const c of chunks) out = out.replaceAll(c.key, c.value);
  return out;
}

function mdLinksToPlain(text: string) {
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, t, u) => `${t} (${u})`);
}

function mdTablesToPlain(text: string) {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const isHeader = /^\|.*\|$/.test(line);
    const next = lines[i + 1] ?? "";
    const isSep = /^\|\s*[:\- ]+\|/.test(next);
    if (!isHeader || !isSep) { out.push(line); i += 1; continue; }
    const headers = line.trim().slice(1, -1).split("|").map((s) => s.trim());
    i += 2;
    const rows: string[][] = [];
    while (i < lines.length && /^\|.*\|$/.test(lines[i])) {
      const cells = lines[i].trim().slice(1, -1).split("|").map((s) => s.trim());
      rows.push(cells);
      i += 1;
    }
    if (!rows.length) { out.push(""); continue; }
    for (let r = 0; r < rows.length; r++) {
      const cells = rows[r];
      for (let c = 0; c < headers.length; c++) {
        const h = headers[c] ?? `Coluna ${c + 1}`;
        const v = (cells[c] ?? "").trim();
        if (!h && !v) continue;
        out.push(`${h}: ${v}`);
      }
      if (r !== rows.length - 1) out.push("");
    }
  }
  return out.join("\n");
}

function cleanupMarkdown(text: string) {
  let out = text;
  out = out.replace(/^\s*---+\s*$/gm, "────────────");
  out = out.replace(/^\s*>\s?/gm, "");
  out = mdLinksToPlain(out);
  out = mdTablesToPlain(out);
  return out;
}

function normalizeBullets(text: string, bullet = "•") {
  return text.replace(/^(\s*)(?:[-+*]|\d+[.)])\s+/gm, (_m, indent) => `${indent}${bullet} `);
}

export function formatForWhatsApp(input: string) {
  const code = protectCode(normalize(input));
  let out = cleanupMarkdown(code.out);
  out = out.replace(/^#{1,6}\s+(.*)$/gm, (_m, t) => `*${t.trim()}*`);
  out = out.replace(/\*\*([^*\n]+?)\*\*/g, (_m, g1) => `*${g1}*`);
  out = normalizeBullets(out, "•");
  out = out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return restoreProtected(out, code.chunks);
}

export function formatForLinkedIn(input: string) {
  const code = protectCode(normalize(input));
  let out = cleanupMarkdown(code.out);
  out = out.replace(/^#{1,6}\s+(.*)$/gm, (_m, t) => `${t.trim().toUpperCase()}\n`);
  out = out.replace(/\*\*([^*\n]+?)\*\*/g, (_m, g1) => `*${g1}*`);
  out = normalizeBullets(out, "•");
  out = out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return restoreProtected(out, code.chunks);
}

export function formatForInstagram(input: string) {
  return formatForLinkedIn(input);
}

export function splitByMaxLen(text: string, maxLen: number): string[] {
  const t = normalize(text).trim();
  if (!t) return [""];
  if (maxLen <= 0) return [t];
  const blocks = t.split(/\n{2,}/g).map((b) => b.trim()).filter(Boolean);
  const chunks: string[] = [];
  let cur = "";
  const pushCur = () => { if (cur.trim()) chunks.push(cur.trimEnd()); cur = ""; };
  for (const block of blocks) {
    if (!cur) { cur = block; continue; }
    if (cur.length + 2 + block.length <= maxLen) { cur += `\n\n${block}`; }
    else { pushCur(); cur = block; }
  }
  pushCur();
  return chunks.length ? chunks : [t];
}
