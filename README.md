<div align="center">

<img src="public/icon.png" alt="Guebly" width="80" />

# guebly.pdf

**README to PDF Engine**

Transforme qualquer `README.md` em um PDF premium — com live preview, formatador social e múltiplos temas de documento.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-blue)](https://github.com/guebly/guebly-readme-to-pdf)
[![Made by Guebly](https://img.shields.io/badge/Made%20by-Guebly-7c3aed)](https://guebly.com.br)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://pdf.guebly.com.br)

[🌐 Acessar](https://pdf.guebly.com.br) · [🐛 Reportar bug](https://github.com/guebly/guebly-readme-to-pdf/issues) · [✨ Sugerir feature](https://github.com/guebly/guebly-readme-to-pdf/issues)

</div>

---

## ✨ Features

- 📁 **Drag & Drop** — arraste seu `.md`, `.txt` ou `.markdown` direto na tela
- 👁 **Live preview** — visualizador renderizado em tempo real
- 🎨 **3 temas de exportação** — Terminal, Premium Docs e Minimal
- 📤 **Export PDF** — renderizado via browser, sem servidor, sem dados enviados
- 🌐 **Formatador social** — LinkedIn, Instagram e WhatsApp com split por blocos
- 📊 **Stats em tempo real** — palavras, chars, linhas, títulos, blocos de código
- 🌙 **Dark / Light mode** — persistido no `localStorage`
- 🔒 **Zero coleta de dados** — tudo roda client-side
- 🧩 **Zero deps de runtime** — parser e formatadores escritos à mão em TypeScript

---

## 🚀 Getting Started

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18.x
- npm >= 9.x

### Instalação

```bash
git clone https://github.com/guebly/guebly-readme-to-pdf
cd guebly-readme-to-pdf
npm install
```

### Rodando localmente

```bash
npm run dev
# ou
npm start
```

Acesse em: **http://localhost:5173**

### Build de produção

```bash
npm run build
npm run preview
```

---

## 🗂 Estrutura do projeto

```
guebly-readme-to-pdf/
├── public/
│   └── icon.png                # Ícone da aplicação
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Componente principal
│   ├── styles.css              # Design system (CSS variables)
│   ├── components/
│   │   └── ThemeToggle.tsx     # Toggle dark/light mode
│   └── lib/
│       ├── markdown.ts         # Parser Markdown (zero deps)
│       └── formatters.ts       # Formatadores social
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🛠 Stack

| Ferramenta | Função |
|---|---|
| React 18 + Vite | Frontend e bundler |
| TypeScript | Tipagem estática |
| Tailwind CSS | Utility classes |
| Syne + Geist Mono | Tipografia (Google Fonts) |

---

## 📤 Deploy

Bundle 100% estático em `dist/`. Hospede em qualquer plataforma:

```bash
# Vercel (recomendado)
vercel

# Netlify
netlify deploy --prod --dir=dist

# GitHub Pages
npx gh-pages -d dist
```

---

## 🤝 Contributing

Contribuições são bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um PR.

---

## 📄 License

MIT — veja [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Made with ♥ by [Guebly](https://guebly.com.br) · [@guebly](https://github.com/guebly)

</div>
