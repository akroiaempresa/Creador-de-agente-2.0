# 🤖 crear-agente — Skill para Claude Code

> Crea automatizaciones inteligentes (agentes de IA) en la nube de Cloudflare,
> en español sencillo, aunque nunca hayas programado.

![Versión](https://img.shields.io/badge/versión-1.1.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)
![Stack](https://img.shields.io/badge/stack-Cloudflare%20Workers%20%2B%20OpenAI-orange)
![Idioma](https://img.shields.io/badge/idioma-Español%20LATAM-red)

---

## ¿Qué es esto?

Un **skill para Claude Code** que te guía paso a paso para construir y publicar
tu propio agente de IA en la nube, desde cero.

Un **agente** es un programa que corre solo en internet —sin que tu computadora
esté encendida— y hace algo útil para ti de forma automática:

- 📰 **Daily Brief:** lee noticias de tus fuentes favoritas, las resume con IA y te las manda al celular cada mañana
- 🔔 **Site Monitor:** revisa si tu sitio web está caído y te alerta al instante
- 📊 **Content Classifier:** clasifica tus emails o menciones por importancia
- 🕵️ **Brand Monitor:** detecta menciones de tu marca o keywords en internet
- 📝 **Content Generator:** genera ideas o borradores de contenido cada semana
- 📈 **Data Tracker:** monitorea precios, datos o métricas que te importan

---

## Requisitos previos

| Herramienta | Versión mínima | Para qué |
|-------------|---------------|----------|
| [Node.js](https://nodejs.org) | v20 o mayor | Correr el código |
| [Claude Code](https://claude.ai/code) | Última | El asistente que usa este skill |
| Cuenta en [Cloudflare](https://cloudflare.com) | Gratis | La "casa" del agente |
| Cuenta en [OpenAI](https://platform.openai.com) | ~$5 de crédito | El cerebro IA |

---

## Instalación

### Mac y Linux (1 línea):
```bash
curl -fsSL https://raw.githubusercontent.com/TU_USUARIO/crear-agente/main/install.sh | bash
```

### Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/TU_USUARIO/crear-agente/main/install.ps1 | iex
```

### Manual (cualquier sistema):
```bash
git clone https://github.com/TU_USUARIO/crear-agente.git ~/.claude/skills/crear-agente
```

---

## Uso

Una vez instalado, abre Claude Code y escribe:

```
/crear-agente
```

O describe lo que quieres:

```
Quiero un agente que me resuma las noticias de tecnología cada mañana
```

Claude Code detectará el skill y te guiará por todo el proceso (~45-60 min la primera vez).

---

## Costo estimado

| Qué | Costo |
|-----|-------|
| Cloudflare Workers | Gratis (100k requests/día) |
| OpenAI (GPT-4o mini) | ~$1-3/mes según uso |
| Pushover (notificaciones) | $4.99 una vez (sin suscripción) |
| Notion | Gratis |
| **Total primer mes** | **~$7-8 USD** |
| **Total meses siguientes** | **~$1-3 USD** |

---

## Estructura del skill

```
crear-agente/
├── SKILL.md                    ← protocolo principal (Claude lo lee aquí)
├── CHANGELOG.md                ← historial de cambios
├── CONTRIBUTING.md             ← cómo contribuir
├── walkthroughs/               ← guías paso a paso para cada cuenta/servicio
│   ├── 01-instalar-node.md
│   ├── 02-cloudflare-cuenta.md
│   ├── 03-openai-cuenta.md
│   └── 99-troubleshooting.md   ← soluciones a los errores más comunes
├── blueprints/                 ← código base que se combina por agente
│   ├── worker-skeleton.ts      ← estructura base del agente
│   ├── wrangler-template.jsonc ← configuración de Cloudflare
│   └── fragments/              ← piezas intercambiables
│       ├── scrape-rss.ts
│       ├── scrape-website.ts
│       ├── llm-summarize.ts
│       ├── save-notion.ts
│       └── notify-pushover.ts
└── examples/                   ← agentes completos y funcionales
    ├── daily-news-brief/       ← resumen de noticias diario
    └── site-monitor/           ← monitor de disponibilidad
```

---

## Seguridad

⚠️ **Importante sobre tus llaves de acceso:**

- Nunca pegues una llave de acceso en el chat con Claude
- El skill siempre guarda las llaves en el archivo `.dev.vars` (solo en tu compu)
- Para subirlas a Cloudflare, usa `npx wrangler secret put` (encriptadas)
- El archivo `.dev.vars` está en el `.gitignore` — nunca se sube a internet

---

## Contribuir

¿Quieres agregar una integración, mejorar un walkthrough o reportar un bug?
Lee [CONTRIBUTING.md](./CONTRIBUTING.md) — toda ayuda es bienvenida.

---

## Comunidad y soporte

- 👥 **Comunidad Skool:** https://skool.com/akroia
- 🐛 **Issues:** abre uno en este repositorio
- 🐦 **Twitter:** @tazeebtw

---

## Licencia

MIT — úsalo, modifícalo y compártelo libremente.
