# CHANGELOG

Todos los cambios notables de este proyecto se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).
Versionado según [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.1.0] — 2025-06-01

### ✅ Agregado
- **Fase 6 de verificación** antes del test local: el skill ahora verifica con `grep "PEGA_AQUI" .dev.vars` que todas las llaves estén reemplazadas antes de intentar correr el agente
- **Ejemplos completos** en `examples/daily-news-brief/` y `examples/site-monitor/` — agentes reales y funcionales que sirven como referencia
- **Fragment `scrape-website.ts`** — extrae contenido de páginas web estáticas sin dependencias externas
- **Método `clasificarConIA`** en `llm-summarize.ts` — permite clasificar ítems por importancia (alta / media / baja)
- **Reintentos automáticos** en `notify-pushover.ts` con backoff exponencial
- **Walkthrough de troubleshooting** (`walkthroughs/99-troubleshooting.md`) con los 15 errores más comunes y sus soluciones
- **`CONTRIBUTING.md`** con guía para contribuidores
- **`CHANGELOG.md`** (este archivo)

### 🔒 Seguridad
- **NUNCA pedir API keys en el chat** — ahora es una regla dura en el SKILL.md con protocolo explícito: las llaves solo van en `.dev.vars` o via `wrangler secret put`
- **Validación de placeholders** — los fragments detectan si las llaves no fueron reemplazadas y lanzan mensajes de error claros en español

### 🐛 Corregido
- **Bug YAML en frontmatter del SKILL.md** — el campo `description` ahora usa bloque literal (`|`) para evitar errores del parser
- **`wrangler.jsonc`** — `compatibility_date` actualizado; ahora con comentarios explicativos para cada sección

### 🔧 Mejorado
- **`worker-skeleton.ts`** — tipado TypeScript completo, estructura modular con métodos separados (`recopilar`, `procesar`, `guardar`, `notificar`), endpoint `/status` agregado
- **`llm-summarize.ts`** — manejo explícito de errores 401 y 429 de OpenAI con mensajes en español
- **`scrape-rss.ts`** — soporte para Atom 1.0 además de RSS 2.0; filtrado por fecha con opción `horasAtras`
- **`save-notion.ts`** — validación de placeholders; soporte para `etiquetas` y `url` opcionales
- **SKILL.md** — Fase 0 ahora detecta OS automáticamente; glosario ampliado; instrucción de detener el skill si faltan prerequisites

---

## [1.0.0] — 2025-05-01

### ✅ Primera versión pública
- SKILL.md con flujo de 8 fases para crear agentes desde cero
- Blueprints base: `worker-skeleton.ts`, `wrangler-template.jsonc`
- Fragments iniciales: `scrape-rss.ts`, `llm-summarize.ts`, `notify-pushover.ts`, `save-notion.ts`
- Walkthroughs de cuentas: Cloudflare, OpenAI, Apify, Notion, Pushover
- Instaladores: `install.sh` (Mac/Linux) y `install.ps1` (Windows)
- Licencia MIT
