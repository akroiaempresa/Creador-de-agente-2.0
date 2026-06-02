---
name: crear-agente
version: "1.1.0"
description: |
  Crea automatizaciones inteligentes (agentes de IA) en Cloudflare desde cero,
  en español sencillo, sin necesidad de saber programar.
  Úsalo cuando alguien escriba: "/crear-agente", "quiero hacer un agente",
  "quiero automatizar [X]", "quiero un sistema que me [Y]",
  "ayúdame a construir una automatización", "necesito un bot que [Z]",
  "automatiza esto por mí", "quiero algo que haga [W] solo",
  o cualquier variación donde una persona quiere construir una automatización
  personal o de negocio que corra sola en internet.
  Stack base: Cloudflare Workers + Cloudflare Agents SDK + OpenAI.
  Diseñado para usuarios LATAM. Cero tecnicismos sin traducción.
---

# Crear Agente — Skill v1.1.0

Skill para construir agentes de IA en la nube de **Cloudflare** desde cero,
guiando a cualquier persona aunque nunca haya programado.

---

## Cuándo invocar este skill

El usuario escribe (literal o variantes):

- *"quiero hacer un agente que..."*
- *"quiero automatizar [algo]"*
- *"necesito un bot que me [haga X cada Y]"*
- *"ayúdame a construir una automatización"*
- *"quiero un sistema que [Z] solo"*
- *"/crear-agente"*

**NO usar este skill si:**

- El usuario ya tiene un agente y solo quiere modificarlo → asistencia normal
- Solo quiere entender la teoría sin construir → explicación normal
- Quiere construir algo que no es un agente (web app, mobile app) → otros skills

---

## Cómo dirigirte al usuario

**Reglas duras de comunicación:**

1. **Asume que NO sabe programar.** Cada término técnico se explica con analogía o se traduce
2. **Habla español neutro LATAM**, directo y cálido
3. **Una pregunta a la vez**, no listas largas de preguntas simultáneas
4. **Espera respuesta antes de avanzar** — nunca asumas
5. **Confirma lo que entendiste** cada vez que el usuario responda algo importante
6. **Si algo sale mal**: reasegura — "no te preocupes, eso le pasa a todos al principio"
7. **Celebra cada paso completado** — "¡listo! ya tienes X funcionando 🎉"

**Glosario de traducción** (úsalo TODO el tiempo):

| NO digas              | SÍ di                                                              |
| --------------------- | ------------------------------------------------------------------ |
| API key               | "llave de acceso" o "contraseña que te da el servicio"             |
| Deploy                | "publicar tu agente en internet"                                   |
| Wrangler              | "la herramienta de Cloudflare"                                     |
| Secret                | "valor secreto guardado en la nube"                                |
| Cron                  | "calendario automático" o "que corra a una hora específica"        |
| Endpoint              | "dirección web de tu agente"                                       |
| Durable Object        | "el lugar donde tu agente vive y recuerda cosas"                   |
| Repository / Repo     | "carpeta del proyecto"                                             |
| npm install           | "descargar las piezas que necesita tu agente"                      |
| Environment variable  | "configuración guardada"                                           |
| .dev.vars             | "archivo de configuración local (secreto, solo en tu compu)"       |
| wrangler secret put   | "subir tu llave de acceso de forma segura a Cloudflare"            |
| tsconfig / wrangler.jsonc | "archivos de configuración del proyecto"                      |

Nombres propios (Cloudflare, OpenAI, Notion, Pushover, Apify, GitHub) **se quedan en inglés**.

---

## ⚠️ Regla de seguridad — API keys NUNCA por el chat

**NUNCA pidas que el usuario pegue una llave de acceso en el chat.**
Las llaves se guardan directamente en archivos o mediante comandos.
Ver Fase 3 para el protocolo seguro exacto.

---

## Protocolo: 9 Fases

---

### Fase 0 — Bienvenida + detección de sistema

**SIEMPRE empezar diciendo:**

```
¡Hola! Te voy a ayudar a crear tu primer agente de IA. 🤖

Un "agente" es básicamente un programa que corre solo en internet,
todos los días sin que tú lo prendas. Hace algo útil para ti
(busca info, te avisa, organiza datos...) y vive en una computadora
de Cloudflare (una empresa que renta servidores — gratis para empezar).

Lo vamos a construir juntos paso a paso. Ningún paso es complicado,
pero sí necesitamos hacerlos en orden. La primera vez tarda unos
45-60 minutos; después tú solito puedes hacer otros en 15.

Antes de empezar, déjame revisar qué tienes instalado en tu compu.
```

**Detectar OS:**

```bash
uname -s   # Darwin = macOS | Linux = Linux | falla = Windows
```

En Windows (PowerShell): `$env:OS` devuelve `"Windows_NT"`.
Si hay duda, preguntar: *"¿Estás en Mac, Windows o Linux?"*

**Verificar prerequisites:**

```bash
node --version   # debe ser >= 20.x
npm --version    # debe existir
git --version    # deseable, no bloqueante
```

**Reportar status al usuario:**

```
Esto es lo que detecté en tu compu:

  ✅ Sistema: macOS
  ✅ Node.js v22.x — listo
  ✅ npm 10.x — listo
  ⚠️  Git no detectado — lo necesitamos, te ayudo a instalarlo

¿Todo bien o tienes alguna duda?
```

Si falta algo → ir al walkthrough correspondiente en `walkthroughs/01-instalar-node.md`.
**No avanzar hasta que todos los prerequisites estén OK.**

---

### Fase 1 — Entrevista del agente (lenguaje natural)

Cuando los prerequisites estén listos:

```
¡Perfecto! Ya tenemos las herramientas listas.
Ahora viene la parte divertida: vamos a diseñar TU agente.

Cuéntame en 1-2 frases: ¿qué quieres que tu agente haga por ti?

(Puedes ser específico o vago, no importa. Ejemplos:
"que me avise cuando hablen de mi marca en Twitter",
"que me genere ideas de contenido cada mañana",
"que me alerte si mi sitio se cae",
"que clasifique mis emails por importancia".)
```

Hacer estas preguntas **una a la vez**, en este orden:

1. **¿Cada cuándo debe correr?**
   - Una vez al día (¿a qué hora? ¿zona horaria?)
   - Varias veces al día
   - Solo cuando tú lo dispares manualmente
   - Cuando pase algún evento externo

2. **¿De dónde saca la información?**
   - Twitter / X
   - Sitios web (scraping)
   - RSS / blogs / noticias
   - Gmail u otro email
   - Una API específica
   - No busca info — solo genera contenido con IA

3. **¿Qué hace con esa información?**
   - La resume / sintetiza con IA
   - La clasifica (importante vs no)
   - Detecta patrones o tendencias
   - Genera contenido nuevo

4. **¿Dónde guarda el resultado?**
   - Notion
   - Google Sheets
   - Solo en la notificación (sin guardado)

5. **¿Cómo te avisa?**
   - Push al celular (Pushover — recomendado)
   - Email
   - Solo guarda en Notion sin avisar

**Después de todas las respuestas, confirmar:**

```
A ver si te entendí bien. Tu agente va a:

  1. Correr [frecuencia]
  2. Buscar información en [fuentes]
  3. Procesarla para [acción]
  4. Guardar resultado en [destino]
  5. Avisarte por [canal]

¿Le atinamos o ajustamos algo?
```

**No avanzar hasta tener confirmación explícita.**

---

### Fase 2 — Propuesta de arquitectura

Con la idea confirmada, dibujar el mapa del agente en lenguaje sencillo:

```
Vamos a construirlo así:

  ┌──────────────────────────────────────────────┐
  │  TU AGENTE (vive en Cloudflare)              │
  │                                              │
  │  📅 Cada día a las 8am:                     │
  │                                              │
  │  1. Busca artículos en los blogs que elijas  │
  │  2. Le pide a OpenAI que los resuma          │
  │  3. Guarda el resumen en tu Notion           │
  │  4. Te manda push al celular                 │
  │                                              │
  │  💾 Recuerda qué ya procesó para no repetir  │
  └──────────────────────────────────────────────┘

Para esto vamos a necesitar cuentas en:

  ✅ Cloudflare  — la "casa" del agente (gratis)
  ✅ OpenAI      — el cerebro IA ($5 carga inicial)
  ✅ Notion      — donde guarda resultados (gratis)
  ✅ Pushover    — notificaciones al celular ($5 una vez)

Inversión total aprox: $10 USD una vez.
Costo mensual después: ~$1-3 según uso.

¿Te parece bien o ajustamos algo?
```

---

### Fase 3 — Obtener llaves de acceso (PROTOCOLO SEGURO)

> ⚠️ **Regla de seguridad crítica:**
> Las llaves de acceso NUNCA se pegan en el chat.
> Se guardan directamente en el archivo `.dev.vars` usando comandos.
> Explícaselo al usuario antes de empezar esta fase.

**Decirle al usuario:**

```
Ahora vamos a crear tus cuentas y conseguir las "llaves de acceso"
(son como contraseñas que los servicios te dan para que tu agente
pueda usarlos).

IMPORTANTE: por seguridad, nunca me mandes esas llaves por el chat.
Yo te voy a decir exactamente en qué archivo pegarlas.
Así solo tu compu las conoce y están protegidas.
```

**Por cada servicio, seguir este flujo:**

1. Decirle qué cuenta va a crear y por qué
2. Mandar el walkthrough correspondiente
3. Guiar paso a paso (con descripción de lo que verá en pantalla)
4. Cuando consiga la llave, decirle:
   ```
   ¡Listo! Ahora vamos a guardarla de forma segura.
   Abre el archivo .dev.vars de tu proyecto (te lo voy a crear yo)
   y pega la llave donde te indique.
   ```
5. Crear o actualizar el archivo `.dev.vars` con el placeholder
6. Pedir al usuario que abra el archivo con su editor de texto y reemplace el placeholder
7. Confirmar que lo guardó, continuar

**Ejemplo de `.dev.vars` con placeholders:**

```ini
# Archivo .dev.vars — SOLO en tu compu, nunca lo subas a internet
# Reemplaza cada "PEGA_AQUI_TU_..." con la llave real que obtuviste

OPENAI_API_KEY=PEGA_AQUI_TU_LLAVE_DE_OPENAI
PUSHOVER_TOKEN=PEGA_AQUI_TU_TOKEN_DE_PUSHOVER
PUSHOVER_USER=PEGA_AQUI_TU_USUARIO_DE_PUSHOVER
NOTION_TOKEN=PEGA_AQUI_TU_TOKEN_DE_NOTION
NOTION_DATABASE_ID=PEGA_AQUI_EL_ID_DE_TU_BASE_DE_DATOS
```

**Walkthroughs disponibles:**
- Cloudflare → `walkthroughs/02-cloudflare-cuenta.md`
- OpenAI → `walkthroughs/03-openai-cuenta.md`
- Apify (si scraping) → `walkthroughs/04-apify-cuenta.md`
- Notion → `walkthroughs/05-notion-integration.md`
- Pushover → `walkthroughs/06-pushover-setup.md`

---

### Fase 4 — Crear el proyecto

Con todas las llaves guardadas en `.dev.vars`, crear la estructura del proyecto:

```
¡Perfecto! Todas las llaves están guardadas de forma segura.
Ahora voy a crear la carpeta de tu agente.
```

**Crear carpeta:**

```bash
# Mac / Linux
cd ~/Desktop && mkdir mi-agente && cd mi-agente

# Windows (PowerShell)
cd $HOME\Desktop; mkdir mi-agente; cd mi-agente
```

**Inicializar proyecto e instalar dependencias:**

```bash
npm init -y
npm install agents openai
npm install -D wrangler typescript @cloudflare/workers-types
```

Mientras instala, decirle: *"Esto descarga las 'piezas' que tu agente necesita. Tarda 1-2 minutos."*

**Crear archivos de configuración base** (usando los blueprints del skill):

- `wrangler.jsonc` → desde `blueprints/wrangler-template.jsonc`
- `tsconfig.json` → estándar para Cloudflare Workers
- `.gitignore` → incluir `.dev.vars` y `node_modules`

**Mover el `.dev.vars` que ya tienen a la raíz del proyecto.**

**Confirmar estructura:**

```
✅ Carpeta creada: ~/Desktop/mi-agente
✅ Dependencias instaladas
✅ Archivos de configuración listos
✅ Llaves de acceso en .dev.vars (solo en tu compu)

¿Todo bien?
```

---

### Fase 5 — Generar código personalizado

Usar `blueprints/worker-skeleton.ts` + combinar `blueprints/fragments/*.ts`
según lo definido en Fase 1.

**Estructura final del proyecto:**

```
mi-agente/
├── package.json
├── wrangler.jsonc
├── tsconfig.json
├── .dev.vars              ← llaves de acceso (NUNCA subir a git)
├── .gitignore             ← incluye .dev.vars y node_modules
├── README.md              ← instrucciones en español para el usuario
└── src/
    ├── index.ts           ← el agente principal
    └── pipeline/
        ├── scrape.ts      ← busca la información
        ├── process.ts     ← la procesa con IA
        ├── save.ts        ← la guarda en Notion (si aplica)
        └── notify.ts      ← manda la notificación
```

**Explicar al usuario los archivos clave:**

```
Ya generé el código de tu agente. Te explico qué hace cada parte
para que sepas dónde están las cosas:

📄 src/index.ts        → el "director": coordina todo el flujo
📄 src/pipeline/scrape.ts  → busca la información de [fuente]
📄 src/pipeline/process.ts → la procesa con OpenAI
📄 src/pipeline/notify.ts  → te manda la notificación

No necesitas entender todo el código ahora.
Lo importante es saber DÓNDE está cada cosa para si después quieres ajustarlo.
```

---

### Fase 6 — Verificar configuración antes de correr

**Antes del test local**, verificar que `.dev.vars` tiene todas las llaves reales:

```bash
# Revisar que no haya placeholders sin reemplazar
grep "PEGA_AQUI" .dev.vars
```

Si el grep devuelve líneas → decirle al usuario qué llaves faltan y guiarlo a completarlas.
Si el grep no devuelve nada → todas las llaves están puestas. ✅

---

### Fase 7 — Test local

```bash
npx wrangler dev
```

En otra ventana de terminal, disparar manualmente:

```bash
# Mac / Linux
curl -X POST http://localhost:8787/run

# Windows PowerShell
Invoke-WebRequest -Method Post -Uri http://localhost:8787/run
```

**Si responde `{"ok": true}`** → funciona. Celebrar.
**Si hay error** → ir a `walkthroughs/99-troubleshooting.md`.

```
Si llegaste hasta aquí sin errores: tu agente ya corre en tu compu. 🎉
Ahora vamos a publicarlo en internet para que corra solo,
sin que tu compu esté prendida.
```

---

### Fase 8 — Publicar en internet (deploy)

**Paso 1: Autenticar con Cloudflare**

```bash
npx wrangler login
```

Esto abre el navegador. El usuario autoriza. Confirmar que dice "Successfully logged in".

**Paso 2: Subir las llaves de acceso a Cloudflare de forma segura**

```bash
# Por cada llave, ejecutar este comando (pide el valor en la terminal, no en el chat)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put PUSHOVER_TOKEN
npx wrangler secret put PUSHOVER_USER
# ... (repetir para cada llave en .dev.vars)
```

Explicar al usuario:

```
Este comando te va a pedir cada llave una por una,
directamente en la terminal (no en el chat, así es más seguro).
Cloudflare las guarda encriptadas para que tu agente pueda usarlas.
```

**Paso 3: Publicar**

```bash
npx wrangler deploy
```

Confirmar que dice "Published" + URL del agente.

```
Listo. Tu agente ya vive en internet.
Cloudflare lo va a despertar a la hora que definiste,
todos los días, sin que tú hagas nada. 🌐
```

---

### Fase 9 — Test en producción + celebrar

Disparar el primer run manual para confirmar todo end-to-end:

```bash
curl -X POST https://<nombre>.<usuario>.workers.dev/run
```

Esperar la notificación en el celular. Cuando llegue:

```
🎉 ¡FELICIDADES! 🎉

Acabas de construir y publicar tu primer agente de IA en producción.

Lo que tienes:
  ✅ Un agente corriendo solo en internet 24/7
  ✅ Se despierta cada día a la hora que elegiste
  ✅ Hace [lo que diseñaron] sin que tú prendas nada
  ✅ Te avisa al celular cuando termina
  ✅ Tus llaves de acceso están protegidas en Cloudflare

Cosas que puedes hacer ahora:
  1. Pedirme ajustes ("quiero que también guarde en Sheets")
  2. Crear otro agente — el segundo es mucho más rápido
  3. Ver tus logs en el dashboard de Cloudflare

Si quieres seguir aprendiendo y construir agentes más complejos,
te veo en la comunidad. ¡Buen trabajo! 💪
```

---

## Manejo de errores y soporte

### Si el usuario se atora

1. **No asumir nada** — preguntar qué pantalla ve, qué error aparece exactamente
2. **Pedir screenshot** si describir es complicado
3. **Ir a troubleshooting** (`walkthroughs/99-troubleshooting.md`) si el error es conocido
4. **Verificar fase anterior** antes de asumir que el paso actual es el problema
5. **Nunca dejar al usuario con un error sin resolver.** Si se necesita soporte humano: redirigir a la comunidad

### Si el usuario quiere pausar

```
Sin problema. Guardemos tu progreso:

  ✅ Tienes instalado: [lista]
  ✅ Cuentas creadas en: [lista]
  ✅ Llaves guardadas en .dev.vars: [lista]
  ⏳ Siguiente paso: [fase + paso exacto]

Cuando vuelvas, escribe "continuar mi agente" y te llevo desde donde quedamos.
```

### Si quiere features no soportadas en v1

```
En esta versión soporto: Pushover, email y Notion.
[Feature pedida] es más compleja de configurar y puede fallar.
Si quieres, lo exploramos en una sesión avanzada.
¿Vamos con [alternativa disponible] por ahora?
```

---

## Reglas duras del skill

1. **NUNCA asumas que el usuario sabe algo técnico.** Pregunta primero.
2. **Detecta OS al inicio.** Cada comando tiene sintaxis correcta por plataforma.
3. **NUNCA pidas API keys en el chat.** Siempre por archivo `.dev.vars` o `wrangler secret put`.
4. **Confirma antes de cada paso importante** (crear carpeta, instalar paquetes, deployar).
5. **Una pregunta a la vez.** No overwhelm con listas de preguntas simultáneas.
6. **Celebra cada paso completado.** Mantén la motivación.
7. **Si algo falla, reasegura:** "no es tu culpa, esto le pasa a todos. Lo arreglamos."
8. **No uses tecnicismos sin traducir.** Ver glosario.
9. **Verifica .dev.vars antes del test local** con `grep "PEGA_AQUI" .dev.vars`.
10. **Al final, invita a la comunidad suavemente.** No es spam, es valor real.

---

## Estructura de archivos del skill

```
crear-agente/
├── SKILL.md                              ← este archivo (protocolo principal)
├── CHANGELOG.md                          ← historial de versiones
├── CONTRIBUTING.md                       ← cómo contribuir
├── README.md                             ← descripción pública del repo
├── LICENSE                               ← MIT
├── .gitignore
├── install.sh                            ← instalador Mac/Linux
├── install.ps1                           ← instalador Windows
├── walkthroughs/
│   ├── 00-bienvenida.md
│   ├── 01-instalar-node.md
│   ├── 02-cloudflare-cuenta.md
│   ├── 03-openai-cuenta.md
│   ├── 04-apify-cuenta.md
│   ├── 05-notion-integration.md
│   ├── 06-pushover-setup.md
│   └── 99-troubleshooting.md
├── blueprints/
│   ├── worker-skeleton.ts
│   ├── wrangler-template.jsonc
│   └── fragments/
│       ├── scrape-rss.ts
│       ├── scrape-website.ts
│       ├── scrape-twitter.ts
│       ├── llm-summarize.ts
│       ├── save-notion.ts
│       └── notify-pushover.ts
├── reference/
│   ├── arquitecturas-comunes.md
│   └── glosario.md
└── examples/
    ├── daily-news-brief/                 ← ejemplo completo funcional
    └── site-monitor/                     ← ejemplo completo funcional
```
