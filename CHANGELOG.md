# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e o projeto adota [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] — 2025

### Added

- Drag & drop de arquivos `.md`, `.txt` e `.markdown`
- Live preview renderizado em tempo real via parser Markdown próprio
- Três temas de exportação: **Terminal**, **Premium Docs** e **Minimal**
- Export PDF via `window.print()` com estilos específicos por tema
- Formatador social para **LinkedIn**, **Instagram** e **WhatsApp**
- Modo **SPLIT** — divide o output social em blocos por limite de caracteres
- Copy individual de cada bloco dividido
- Stats bar em tempo real: palavras, chars, linhas, títulos, blocos de código
- Aba **HTML raw** com visualização do HTML gerado pelo parser
- Dark / Light mode com persistência via `localStorage`
- Quick-insert de snippets Markdown via badges clicáveis
- Download do conteúdo atual como arquivo `.md`
- Botão de cópia do Markdown bruto
- Zero coleta de dados — tudo roda client-side
- Design system completo com CSS variables para ambos os temas
- Animações de entrada com `fadeUp` escalonado
- Compatibilidade com arquivos grandes sem degradação de performance

---

## [Unreleased]

### Planned

- Suporte a diagramas Mermaid
- Mais plataformas sociais (Threads, X/Twitter, Telegram)
- Temas adicionais de exportação
- Front matter YAML
- Testes unitários

---

[1.0.0]: https://github.com/guebly/guebly-readme-to-pdf/releases/tag/v1.0.0
[Unreleased]: https://github.com/guebly/guebly-readme-to-pdf/compare/v1.0.0...HEAD
