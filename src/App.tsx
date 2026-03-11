// src/App.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Upload, FileText, Download, Copy, Trash2, Eye, Code2,
  CheckCircle, AlertCircle, Info, Github, X,
  Terminal, Globe, Shield, Star, Moon, Sun,
} from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { parseMarkdown } from "./lib/markdown";
import {
  formatForWhatsApp,
  formatForLinkedIn,
  formatForInstagram,
  splitByMaxLen,
} from "./lib/formatters";

// ─── Types ──────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";
type RightTab = "preview" | "social" | "raw";
type Platform = "linkedin" | "instagram" | "whatsapp";
type DocTheme = "terminal" | "premium" | "minimal";
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  msg: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PLATFORMS: Record<Platform, { label: string; maxLen: number }> = {
  linkedin:  { label: "LinkedIn",  maxLen: 3500 },
  instagram: { label: "Instagram", maxLen: 2200 },
  whatsapp:  { label: "WhatsApp",  maxLen: 3500 },
};

const DOC_THEMES: Record<DocTheme, { label: string; icon: string }> = {
  terminal: { label: "Terminal",     icon: "⬛" },
  premium:  { label: "Premium Docs", icon: "📄" },
  minimal:  { label: "Minimal",      icon: "⬜" },
};

const DEMO_MD = `# Guebly README to PDF

> Transforme qualquer README.md em um PDF premium. Open-source, sem coleta de dados.

## 🚀 Features

- **Upload drag & drop** — arraste seu \`.md\` e pronto
- **Visualizador ao vivo** — preview renderizado em tempo real
- **Formatador social** — LinkedIn, Instagram, WhatsApp
- **Tema escuro/claro** — persistido localmente
- **Export PDF** — renderizado como documento premium

## 📦 Instalação

\`\`\`bash
git clone https://github.com/guebly/readme-to-pdf
cd readme-to-pdf
npm install
npm run dev
\`\`\`

## 🛠 Stack

| Ferramenta | Função |
|------------|--------|
| React + Vite | Frontend |
| Tailwind CSS | Styling |
| markdown-it | Parser |
| Playwright | PDF render |

## 📝 Uso

1. Arraste seu \`README.md\` para a área de upload
2. Visualize o preview renderizado em tempo real
3. Escolha o tema do documento
4. Clique em **Exportar PDF**

## Licença

MIT — use como quiser.
`;

// ─── Toast hook ───────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((type: ToastType, msg: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

// ─── Toasts component ────────────────────────────────────────────────────────
function Toasts({ toasts }: { toasts: Toast[] }) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={15} />,
    error:   <AlertCircle size={15} />,
    info:    <Info size={15} />,
  };
  const colors: Record<ToastType, string> = {
    success: "var(--success)",
    error:   "var(--error)",
    info:    "var(--accent)",
  };
  return (
    <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} className="toast" style={{ color: colors[t.type] }}>
          {icons[t.type]}
          <span style={{ color: "var(--text)" }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stats component ─────────────────────────────────────────────────────────
function Stats({ md }: { md: string }) {
  const words    = useMemo(() => md.trim().split(/\s+/).filter(Boolean).length, [md]);
  const chars    = md.length;
  const lines    = md.split("\n").length;
  const headings = (md.match(/^#{1,6}\s/gm) ?? []).length;
  const codeBlocks = Math.round(((md.match(/```/g) ?? []).length) / 2);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 8 }}>
      {[
        { num: words,                 label: "Palavras" },
        { num: chars.toLocaleString(), label: "Chars"   },
        { num: lines,                 label: "Linhas"   },
        { num: headings,              label: "Títulos"  },
        { num: codeBlocks,            label: "Blocos"   },
      ].map((s) => (
        <div key={s.label} className="stat-card">
          <div className="stat-num">{s.num}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── PDF styles per docTheme ─────────────────────────────────────────────────
function getPdfStyles(docTheme: DocTheme): string {
  if (docTheme === "terminal") {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&display=swap');
      body { background: #1e1e2e; color: #cdd6f4; font-family: 'Geist Mono', monospace; padding: 48px; line-height: 1.65; }
      h1 { color: #89b4fa; font-size: 2em; border-bottom: 2px solid #313244; padding-bottom: 10px; margin-bottom: 16px; }
      h2 { color: #89dceb; font-size: 1.4em; margin: 1.2em 0 0.4em; }
      h3 { color: #a6e3a1; font-size: 1.15em; margin: 1em 0 0.3em; }
      h4, h5, h6 { color: #f5c2e7; margin: 0.8em 0 0.3em; }
      pre { background: #313244; padding: 16px 20px; border-radius: 10px; overflow-x: auto; margin: 12px 0; border-left: 4px solid #89b4fa; }
      code { color: #f38ba8; font-family: 'Geist Mono', monospace; font-size: 0.92em; }
      pre code { color: #cdd6f4; }
      blockquote { border-left: 4px solid #cba6f7; padding-left: 16px; margin: 12px 0; color: #a6adc8; font-style: italic; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0; }
      th { background: #313244; padding: 10px 14px; text-align: left; color: #89b4fa; border: 1px solid #45475a; }
      td { padding: 8px 14px; border: 1px solid #45475a; }
      tr:nth-child(even) td { background: #252535; }
      a { color: #89b4fa; }
      hr { border: none; border-top: 1px solid #313244; margin: 20px 0; }
      ul, ol { padding-left: 24px; margin: 8px 0; }
      li { margin: 4px 0; }
      img { max-width: 100%; border-radius: 8px; }
    `;
  }
  if (docTheme === "minimal") {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
      body { background: #fff; color: #111; font-family: 'Syne', sans-serif; padding: 64px; max-width: 740px; margin: auto; line-height: 1.7; }
      h1 { font-size: 2.2em; font-weight: 800; letter-spacing: -0.04em; border-bottom: 3px solid #111; padding-bottom: 10px; margin-bottom: 20px; }
      h2 { font-size: 1.4em; font-weight: 700; margin: 1.4em 0 0.4em; letter-spacing: -0.02em; }
      h3 { font-size: 1.1em; font-weight: 700; margin: 1em 0 0.3em; }
      pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0; font-family: monospace; font-size: 13px; }
      code { background: #eee; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
      blockquote { border-left: 4px solid #111; padding-left: 16px; margin: 12px 0; color: #555; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0; }
      th { border-bottom: 2px solid #111; padding: 8px 12px; text-align: left; font-weight: 800; }
      td { padding: 8px 12px; border-bottom: 1px solid #eee; }
      a { color: #111; }
      hr { border: none; border-top: 2px solid #111; margin: 20px 0; }
      ul, ol { padding-left: 24px; margin: 8px 0; }
      li { margin: 4px 0; }
      img { max-width: 100%; }
    `;
  }
  // premium (default)
  return `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Geist+Mono:wght@400;700&display=swap');
    body { background: #fff; color: #0d1117; font-family: 'Syne', sans-serif; padding: 56px; max-width: 820px; margin: auto; line-height: 1.72; }
    h1 { font-size: 2.2em; font-weight: 800; letter-spacing: -0.04em; color: #0d1117; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
    h2 { font-size: 1.45em; font-weight: 700; color: #2563eb; margin: 1.4em 0 0.5em; letter-spacing: -0.02em; }
    h3 { font-size: 1.15em; font-weight: 700; margin: 1em 0 0.3em; }
    h4, h5 { font-size: 1em; font-weight: 700; margin: 0.8em 0 0.2em; }
    pre { background: #f6f8fa; padding: 18px 20px; border-radius: 10px; overflow-x: auto; margin: 14px 0; font-family: 'Geist Mono', monospace; font-size: 13px; border-left: 4px solid #2563eb; }
    code { background: #eff6ff; color: #2563eb; padding: 2px 7px; border-radius: 5px; font-family: 'Geist Mono', monospace; font-size: 13px; }
    pre code { background: transparent; color: #24292e; padding: 0; }
    blockquote { border-left: 4px solid #7c3aed; padding-left: 16px; margin: 14px 0; color: #555; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 14px; }
    th { background: #eff6ff; padding: 10px 14px; text-align: left; font-weight: 800; border: 1px solid #e2e8f0; color: #2563eb; }
    td { padding: 9px 14px; border: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }
    a { color: #2563eb; text-decoration: underline; }
    hr { border: none; border-top: 2px solid #e2e8f0; margin: 20px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 5px 0; }
    img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
    strong { font-weight: 800; }
    em { font-style: italic; color: #555; }
  `;
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const s = localStorage.getItem("guebly_theme");
      return s === "light" || s === "dark" ? s : "dark";
    } catch { return "dark"; }
  });

  const [md, setMd]             = useState(DEMO_MD);
  const [rightTab, setRightTab] = useState<RightTab>("preview");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [maxLen, setMaxLen]     = useState(3500);
  const [dragging, setDragging] = useState(false);
  const [docTheme, setDocTheme] = useState<DocTheme>("premium");
  const [copied, setCopied]     = useState(false);
  const [filename, setFilename] = useState("");

  const { toasts, add: toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("guebly_theme", theme); } catch {}
  }, [theme]);

  const htmlPreview = useMemo(() => parseMarkdown(md), [md]);

  const socialText = useMemo(() => {
    if (platform === "whatsapp")  return formatForWhatsApp(md);
    if (platform === "instagram") return formatForInstagram(md);
    return formatForLinkedIn(md);
  }, [platform, md]);

  const chunks = useMemo(() => {
    if (!splitEnabled) return [socialText];
    return splitByMaxLen(socialText, maxLen || 3500);
  }, [socialText, splitEnabled, maxLen]);

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  const onDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.match(/\.(md|txt|markdown)$/i)) { toast("error", "Somente .md ou .txt"); return; }
    setFilename(file.name);
    const r = new FileReader();
    r.onload = (ev) => { setMd(ev.target?.result as string ?? ""); toast("success", `${file.name} carregado!`); };
    r.readAsText(file);
  }, [toast]);

  const loadFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const r = new FileReader();
    r.onload = (ev) => { setMd(ev.target?.result as string ?? ""); toast("success", `${file.name} carregado!`); };
    r.readAsText(file);
  }, [toast]);

  // ── Copy ──────────────────────────────────────────────────────────────────
  const copyText = useCallback(async (text: string, msg?: string) => {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
    toast("success", msg ?? "Copiado!");
  }, [toast]);

  // ── Download ──────────────────────────────────────────────────────────────
  const downloadMd = useCallback(() => {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || "document.md"; a.click();
    toast("success", "Download iniciado!");
  }, [md, filename, toast]);

  // ── Print PDF ────────────────────────────────────────────────────────────
  const printPdf = useCallback(() => {
    const win = window.open("", "_blank");
    if (!win) return;
    const styles = getPdfStyles(docTheme);
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename || "README"}</title><style>${styles}</style></head><body>${htmlPreview}</body></html>`
    );
    win.document.close();
    setTimeout(() => win.print(), 500);
    toast("success", "Preparando PDF...");
  }, [htmlPreview, docTheme, filename, toast]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Syne', sans-serif", overflowX: "hidden" }}>
      <Toasts toasts={toasts} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      {/* Background glows */}
      <div style={{ position: "fixed", top: -200, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, var(--glow1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -200, left: -150, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, var(--glow2) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* HEADER */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Logo */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 900, fontSize: 18, letterSpacing: "-0.05em", flexShrink: 0,
            }}>G</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: "-0.04em" }}>
                guebly<span style={{ color: "var(--accent)" }}>.pdf</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginTop: 1 }}>
                README to PDF Engine
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="badge"><Star size={10} /> Open-source</span>
            <span className="badge"><Shield size={10} /> Sem coleta</span>
            <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />
            <button className="btn btn-ghost" onClick={() => window.open("https://github.com/guebly/readme-to-pdf", "_blank")}>
              <Github size={14} /> GitHub
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 1400, margin: "0 auto", padding: "24px 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* DROP ZONE */}
        <div
          className={`drop-zone fade-up${dragging ? " drag-over" : ""}`}
          style={{ padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", cursor: "pointer", textAlign: "center" }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".md,.txt,.markdown" style={{ display: "none" }} onChange={loadFile} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
              <Upload size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>
                {filename ? `📄 ${filename}` : "Arraste seu README.md aqui"}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                ou clique para selecionar · .md, .txt, .markdown
              </div>
            </div>
            {md !== DEMO_MD && (
              <button
                className="btn btn-ghost btn-danger"
                onClick={(e) => { e.stopPropagation(); setMd(DEMO_MD); setFilename(""); toast("info", "Demo carregado"); }}
              >
                <X size={13} /> Limpar
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        {md && <div className="fade-up-1"><Stats md={md} /></div>}

        {/* EDITOR GRID */}
        <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, alignItems: "start" }}>

          {/* LEFT: Markdown Input */}
          <div className="glass" style={{ borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Panel Header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Code2 size={15} style={{ color: "var(--accent)" }} />
                <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Editor Markdown</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-ghost btn-danger" style={{ padding: "7px 12px" }} onClick={() => { setMd(""); toast("info", "Editor limpo"); }} title="Limpar">
                  <Trash2 size={13} />
                </button>
                <button className="btn" style={{ padding: "7px 12px" }} onClick={() => copyText(md, "Markdown copiado!")} title="Copiar">
                  <Copy size={13} /> Copiar
                </button>
                <button className="btn" style={{ padding: "7px 12px" }} onClick={downloadMd}>
                  <Download size={13} /> .md
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div style={{ padding: 4, flex: 1 }}>
              <textarea
                value={md}
                onChange={(e) => setMd(e.target.value)}
                placeholder="Cole ou escreva seu Markdown aqui..."
                style={{ width: "100%", minHeight: 520, padding: "14px 16px", borderRadius: 16 }}
              />
            </div>

            {/* Syntax hints */}
            <div style={{ padding: "10px 18px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["# H1", "**bold**", "*italic*", "`code`", "- lista", "> quote", "---", "| tabela |"].map((tag) => (
                <span
                  key={tag}
                  className="badge"
                  style={{ cursor: "pointer", fontSize: 10 }}
                  title={`Inserir: ${tag}`}
                  onClick={() => setMd((m) => m + "\n" + tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Output Panel */}
          <div className="glass" style={{ borderRadius: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Panel Header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, padding: 6, background: "var(--panel2)", borderRadius: 12, border: "1px solid var(--border)" }}>
                {([ 
                  { key: "preview", icon: <Eye size={13} />,      label: "Preview" },
                  { key: "social",  icon: <Globe size={13} />,    label: "Social"  },
                  { key: "raw",     icon: <Terminal size={13} />, label: "HTML"    },
                ] as const).map((t) => (
                  <button
                    key={t.key}
                    className={`tab${rightTab === t.key ? " active" : ""}`}
                    onClick={() => setRightTab(t.key)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Tab actions */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {rightTab === "preview" && (
                  <>
                    <select
                      value={docTheme}
                      onChange={(e) => setDocTheme(e.target.value as DocTheme)}
                      style={{ padding: "7px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--panel)", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "var(--text)" }}
                    >
                      {Object.entries(DOC_THEMES).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                    <button className="btn btn-primary" style={{ padding: "7px 14px" }} onClick={printPdf}>
                      <Download size={13} /> Exportar PDF
                    </button>
                  </>
                )}
                {rightTab === "social" && (
                  <button className="btn" style={{ padding: "7px 12px" }} onClick={() => copyText(chunks[0] ?? "", "1º bloco copiado!")}>
                    {copied ? <CheckCircle size={13} /> : <Copy size={13} />} Copiar
                  </button>
                )}
                {rightTab === "raw" && (
                  <button className="btn" style={{ padding: "7px 12px" }} onClick={() => copyText(htmlPreview, "HTML copiado!")}>
                    <Copy size={13} /> HTML
                  </button>
                )}
              </div>
            </div>

            {/* TAB: Preview */}
            {rightTab === "preview" && (
              <div style={{ padding: "20px 24px", overflowY: "auto", maxHeight: 620 }}>
                {docTheme === "terminal" && (
                  <div style={{ marginBottom: 0, padding: "10px 16px", background: "#1e1e2e", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56", display: "inline-block" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f", display: "inline-block" }} />
                    <span style={{ marginLeft: 10, fontSize: 11, color: "#6c7086", fontFamily: "monospace" }}>
                      {filename || "README.md"}
                    </span>
                  </div>
                )}
                <div
                  className="preview-output"
                  style={docTheme === "terminal" ? {
                    background: "#1e1e2e", color: "#cdd6f4",
                    padding: "20px 24px",
                    borderRadius: "0 0 12px 12px",
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 13, lineHeight: 1.65,
                  } : {
                    fontSize: 14, lineHeight: 1.72,
                    ...(docTheme === "minimal" ? { fontFamily: "'Syne', sans-serif" } : {}),
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlPreview || "<p style='color:var(--muted)'>Nada para mostrar ainda...</p>" }}
                />
              </div>
            )}

            {/* TAB: Social */}
            {rightTab === "social" && (
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Platform + split controls */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 4, padding: 5, background: "var(--panel2)", borderRadius: 12, border: "1px solid var(--border)" }}>
                    {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([k, v]) => (
                      <button key={k} className={`tab${platform === k ? " active" : ""}`} onClick={() => setPlatform(k)}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "var(--muted)", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={splitEnabled}
                        onChange={(e) => setSplitEnabled(e.target.checked)}
                        style={{ accentColor: "var(--accent)" }}
                      />
                      DIVIDIR
                    </label>
                    {splitEnabled && (
                      <input
                        type="number"
                        value={maxLen}
                        onChange={(e) => setMaxLen(Number(e.target.value))}
                        min={200} max={10000}
                        style={{
                          width: 80, padding: "5px 10px", borderRadius: 8,
                          border: "1px solid var(--border)",
                          background: "var(--panel2)", color: "var(--text)",
                          fontSize: 12, fontWeight: 700, fontFamily: "monospace",
                          outline: "none",
                        }}
                      />
                    )}
                  </div>
                </div>

                {chunks.length > 1 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {chunks.map((c, i) => (
                      <button key={i} className="btn" style={{ padding: "5px 12px", fontSize: 10 }} onClick={() => copyText(c, `Bloco ${i + 1} copiado!`)}>
                        <Copy size={11} /> Bloco {i + 1} ({c.length} chars)
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  readOnly
                  value={chunks.join("\n\n─────────── PRÓXIMO BLOCO ───────────\n\n")}
                  placeholder="Selecione a plataforma e o texto aparecerá aqui..."
                  style={{
                    width: "100%", minHeight: 440,
                    padding: "14px 16px", borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--panel2)",
                  }}
                />

                <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Info size={12} />
                  {chunks.length} bloco(s) · {socialText.length.toLocaleString()} chars · limite {PLATFORMS[platform].maxLen.toLocaleString()}
                </div>
              </div>
            )}

            {/* TAB: Raw HTML */}
            {rightTab === "raw" && (
              <div style={{ padding: "16px 18px" }}>
                <pre style={{
                  background: "var(--code-bg)", color: "var(--code-text)",
                  padding: "16px 18px", borderRadius: 14,
                  fontSize: 11.5, lineHeight: 1.6,
                  overflowX: "auto", overflowY: "auto",
                  maxHeight: 550,
                  whiteSpace: "pre-wrap", wordBreak: "break-all",
                  fontFamily: "'Geist Mono', monospace",
                }}>
                  {htmlPreview || "Nada ainda..."}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="fade-up-3" style={{
          textAlign: "center", padding: "16px 0 0",
          color: "var(--muted)", fontSize: 11,
          fontFamily: "'Geist Mono', monospace",
          display: "flex", gap: 16, justifyContent: "center",
          alignItems: "center", flexWrap: "wrap",
        }}>
          <span>© {new Date().getFullYear()} Guebly</span>
          <span>·</span>
          <span className="badge"><Star size={9} /> Open-source</span>
          <span className="badge"><Shield size={9} /> Sem coleta de dados</span>
          <span>·</span>
          <a
            href="https://github.com/guebly/readme-to-pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 11 }}
          >
            <Github size={12} /> guebly/readme-to-pdf
          </a>
        </footer>
      </main>
    </div>
  );
}
