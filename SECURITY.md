# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x | ✅ |

## Reporting a Vulnerability

Se você encontrar uma vulnerabilidade de segurança, **não abra uma issue pública**.

Entre em contato diretamente em: [contato@guebly.com.br](mailto:contato@guebly.com.br)

Inclua na mensagem:

- Descrição da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Sugestão de correção (se houver)

Você receberá uma resposta em até **72 horas**. Agradecemos o disclosure responsável.

---

## Nota sobre arquitetura

guebly.pdf é uma aplicação **100% client-side**. Nenhum dado do usuário é enviado a servidores. O único risco de segurança relevante é XSS via parsing de Markdown — o que é mitigado pelo escape de `&`, `<` e `>` antes de qualquer transformação no parser (`src/lib/markdown.ts`).
