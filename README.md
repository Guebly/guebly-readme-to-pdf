# guebly.pdf — README to PDF Engine

> Transform any README.md into a premium PDF. Live preview, social formatter (LinkedIn, Instagram, WhatsApp), terminal & minimal themes, dark/light mode. Open-source, zero data collection.

## ✨ Features

- **Drag & Drop upload** — arraste seu `.md` e pronto
- **Live preview** — visualizador renderizado em tempo real
- **3 temas de exportação** — Terminal, Premium Docs, Minimal
- **Formatador social** — LinkedIn, Instagram, WhatsApp com divisão por blocos
- **Dark / Light mode** — persistido localmente
- **Export PDF** — renderizado via browser (print-to-PDF)
- **HTML raw** — visualize o HTML gerado
- **Stats em tempo real** — palavras, chars, linhas, títulos, blocos de código
- **Zero dependências externas de runtime** — apenas React + Vite

## 📦 Instalação

```bash
git clone https://github.com/guebly/readme-to-pdf
cd guebly-readme-to-pdf
npm install
npm run dev
```

## 🛠 Build

```bash
npm run build
npm run preview
```

## 🗂 Estrutura

```
src/
  App.tsx                  # Componente principal
  styles.css               # Design system (CSS variables)
  main.tsx                 # Entry point
  components/
    ThemeToggle.tsx         # Botão dark/light mode
  lib/
    markdown.ts             # Parser Markdown (zero deps)
    formatters.ts           # Formatadores social (LinkedIn/IG/WA)
```

## 📄 Licença

MIT — use como quiser.

---

Made with ♥ by [Guebly](https://guebly.com.br)
