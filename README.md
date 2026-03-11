<div align="center">

<img src="https://www.guebly.com.br/logo-email.png" alt="Guebly" height="48" />

# guebly.pdf

**README to PDF Engine**

Transform any `README.md` into a premium-quality PDF — with live preview, social formatter, and multiple document themes.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-blue)](https://github.com/guebly/guebly-readme-to-pdf)
[![Made by Guebly](https://img.shields.io/badge/Made%20by-Guebly-7c3aed)](https://guebly.com.br)

[Demo](#) · [Report Bug](https://github.com/guebly/guebly-readme-to-pdf/issues) · [Request Feature](https://github.com/guebly/guebly-readme-to-pdf/issues)

</div>

---

## ✨ Features

- 📁 **Drag & Drop upload** — arraste seu `.md`, `.txt` ou `.markdown` direto
- 👁 **Live preview** — visualizador renderizado em tempo real
- 🎨 **3 temas de exportação** — Terminal, Premium Docs e Minimal
- 📤 **Export PDF** — renderizado via browser, sem servidor
- 🌐 **Formatador social** — LinkedIn, Instagram e WhatsApp com split por blocos
- 🌙 **Dark / Light mode** — persistido no `localStorage`
- 📊 **Stats em tempo real** — palavras, chars, linhas, títulos, blocos de código
- 🔒 **Zero coleta de dados** — tudo roda no client, nada vai a servidor
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
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.cjs
└── src/
    ├── main.tsx                # Entry point
    ├── App.tsx                 # Componente principal
    ├── styles.css              # Design system (CSS variables)
    ├── components/
    │   └── ThemeToggle.tsx     # Toggle dark/light mode
    └── lib/
        ├── markdown.ts         # Parser Markdown (zero deps)
        └── formatters.ts       # Formatadores social
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

O projeto gera um bundle estático em `dist/`. Pode ser hospedado em qualquer plataforma:

| Plataforma | Comando |
|---|---|
| Vercel | `vercel` |
| Netlify | `netlify deploy --prod --dir=dist` |
| GitHub Pages | `npx gh-pages -d dist` |
| Cloudflare Pages | Build: `npm run build` · Output: `dist` |

---

## 🤝 Contributing

Contribuições são muito bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir um PR.

---

## 📋 Changelog

Veja o [CHANGELOG.md](CHANGELOG.md) para o histórico de versões.

---

## 📄 License

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Made with ♥ by [Guebly](https://guebly.com.br) · [@guebly](https://github.com/guebly)

</div>
