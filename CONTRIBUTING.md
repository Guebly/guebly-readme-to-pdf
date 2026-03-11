# Contributing to guebly.pdf

Obrigado pelo interesse em contribuir! Este documento explica como participar do projeto.

---

## 📋 Índice

- [Code of Conduct](#code-of-conduct)
- [Como contribuir](#como-contribuir)
- [Configurando o ambiente](#configurando-o-ambiente)
- [Convenção de commits](#convenção-de-commits)
- [Estilo de código](#estilo-de-código)
- [Abrindo um Pull Request](#abrindo-um-pull-request)
- [Reportando bugs](#reportando-bugs)
- [Sugerindo features](#sugerindo-features)
- [Good first issues](#good-first-issues)

---

## Code of Conduct

Este projeto adota um ambiente respeitoso e colaborativo. Comportamentos como assédio, discriminação ou linguagem agressiva não serão tolerados. Trate todos os colaboradores com respeito.

---

## Como contribuir

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/<seu-usuario>/guebly-readme-to-pdf
   cd guebly-readme-to-pdf
   ```
3. Crie uma **branch** com nome descritivo:
   ```bash
   git checkout -b feat/minha-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```
4. Faça suas alterações
5. **Commit** seguindo a convenção abaixo
6. Abra um **Pull Request** para a branch `main`

---

## Configurando o ambiente

### Pré-requisitos

- Node.js >= 18.x
- npm >= 9.x

### Instalação

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

---

## Convenção de commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Mudanças em documentação |
| `style:` | Formatação de código, sem lógica |
| `refactor:` | Reestruturação sem feature ou fix |
| `chore:` | Build, dependências, configs |
| `perf:` | Melhorias de performance |

**Exemplos:**

```bash
git commit -m "feat: add Mermaid diagram support in preview"
git commit -m "fix: split mode ignoring paragraph boundaries"
git commit -m "docs: update deployment section in README"
```

---

## Estilo de código

- **TypeScript strict** habilitado — sem `any`
- Componentes funcionais com hooks
- State sempre tipado explicitamente
- CSS **apenas via variáveis do design system** — sem hex hardcoded
- Sem novas dependências de runtime sem discussão prévia em issue
- Nomes de variáveis e funções em **inglês**
- Comentários em português são aceitos

---

## Abrindo um Pull Request

- Descreva **o que** foi feito e **por quê**
- Se corrigir um bug, mencione o issue relacionado (`Fixes #42`)
- Se adicionar feature, inclua uma descrição curta do comportamento
- PRs pequenos e focados têm mais chance de revisão rápida
- Screenshots são bem-vindos para mudanças visuais

---

## Reportando bugs

Abra uma [issue](https://github.com/guebly/guebly-readme-to-pdf/issues/new) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. comportamento atual
- Versão do navegador e sistema operacional
- Screenshot se aplicável

---

## Sugerindo features

Abra uma [issue](https://github.com/guebly/guebly-readme-to-pdf/issues/new) com:

- Descrição da feature
- Caso de uso / motivação
- Comportamento esperado
- Alternativas consideradas (se houver)

---

## Good first issues

Áreas onde contribuições são especialmente bem-vindas:

- [ ] Suporte a diagramas Mermaid no preview
- [ ] Mais temas de exportação PDF
- [ ] Mais plataformas sociais (Threads, X/Twitter, Telegram)
- [ ] Melhorias de acessibilidade (ARIA labels, navegação por teclado)
- [ ] i18n / traduções
- [ ] Testes unitários para o parser e formatadores
- [ ] Suporte a front matter YAML

---

<div align="center">

Made with ♥ by [Guebly](https://guebly.com.br) · [@guebly](https://github.com/guebly)

</div>
