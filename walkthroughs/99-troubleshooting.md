# Troubleshooting — Solución de Problemas Comunes

> Si Claude Code te mandó aquí, busca tu error en la lista de abajo.
> Si no encuentras tu error, descríbelo en la comunidad con el texto exacto que aparece.

---

## Errores de instalación

### `node: command not found` o `node is not recognized`
**¿Qué significa?** Node.js no está instalado o el sistema no lo encuentra.

**Solución:**
1. Ve a https://nodejs.org y descarga la versión **LTS** (la recomendada)
2. Instala siguiendo el asistente
3. **Cierra y vuelve a abrir la terminal** (importante)
4. Escribe `node --version` — debe decir `v20.x` o mayor

---

### `npm ERR! code EACCES` (Mac/Linux)
**¿Qué significa?** No tienes permiso para instalar en esa carpeta.

**Solución:**
```bash
# No uses sudo con npm — en su lugar, configura la carpeta de npm:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

---

### `Cannot find module 'agents'`
**¿Qué significa?** Las dependencias no se instalaron correctamente.

**Solución:**
```bash
# Asegúrate de estar dentro de la carpeta de tu agente:
cd ~/Desktop/mi-agente

# Borrar e instalar de nuevo:
rm -rf node_modules package-lock.json
npm install
```

---

## Errores de llaves de acceso

### `Error: OPENAI_API_KEY no configurado`
**¿Qué significa?** La llave de OpenAI no está en tu archivo `.dev.vars`.

**Solución:**
1. Abre el archivo `.dev.vars` (está en la carpeta de tu agente)
2. Busca la línea `OPENAI_API_KEY=PEGA_AQUI_TU_LLAVE_DE_OPENAI`
3. Reemplaza `PEGA_AQUI_TU_LLAVE_DE_OPENAI` con tu llave real
4. Guarda el archivo
5. Reinicia `npx wrangler dev`

> **Tip:** Para ver si quedó bien, corre: `grep "PEGA_AQUI" .dev.vars`
> Si no devuelve nada, todas las llaves están puestas ✅

---

### `AuthenticationError` o `401` de OpenAI
**¿Qué significa?** La llave de OpenAI es inválida o expiró.

**Solución:**
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva llave
3. Actualízala en tu `.dev.vars`
4. Si el error persiste: verifica que tu cuenta tenga crédito en https://platform.openai.com/usage

---

### `RateLimitError` o `429` de OpenAI
**¿Qué significa?** Usaste demasiadas peticiones en poco tiempo, o tu cuenta está en el tier gratuito con límites bajos.

**Solución:**
1. Espera 1 minuto e intenta de nuevo
2. Si pasa seguido: agrega $5-10 de crédito en https://platform.openai.com/settings/billing

---

### Error de Pushover: `user identifier is invalid`
**¿Qué significa?** El `PUSHOVER_USER` está mal copiado.

**Solución:**
1. Abre la app de Pushover en tu celular
2. El User Key está en la pantalla principal (no en el nombre, sino en el código largo)
3. Cópialo completo y actualiza tu `.dev.vars`

---

## Errores de Wrangler / Cloudflare

### `wrangler: command not found`
**¿Qué significa?** Wrangler no está instalado globalmente.

**Solución:** Siempre usa `npx wrangler` en lugar de `wrangler` solo:
```bash
npx wrangler dev     # ✅ Correcto
wrangler dev         # ❌ Puede fallar
```

---

### `Error: Your Worker failed to boot`
**¿Qué significa?** Hay un error de sintaxis en tu código TypeScript.

**Solución:**
1. Lee el error completo — dice exactamente en qué archivo y línea está el problema
2. Abre ese archivo y busca la línea mencionada
3. Comparte el error exacto con Claude Code para que te ayude a corregirlo

---

### `Migrations are required` al hacer deploy
**¿Qué significa?** Es la primera vez que haces deploy y Cloudflare necesita configurar el almacenamiento.

**Solución:** Es normal. Corre:
```bash
npx wrangler deploy
```
El propio comando aplica las migraciones automáticamente.

---

### `Error: Script startup exceeded CPU time limit`
**¿Qué significa?** Tu agente está haciendo demasiado trabajo al arrancar (fuera del handler).

**Solución:** Mueve cualquier operación pesada (fetch, procesamiento) dentro de los métodos `onRequest` o `ejecutar`, no en el nivel global del archivo.

---

### El cron no se ejecuta a la hora que definí
**¿Qué significa?** El cron de Cloudflare funciona en UTC, no en tu zona horaria.

**Solución:** Convierte tu hora a UTC:
- Ciudad de México (UTC-6): suma 6 horas → 8am CDMX = `0 14 * * *`
- Buenos Aires (UTC-3): suma 3 horas → 8am ART = `0 11 * * *`
- Madrid (UTC+2 verano): resta 2 horas → 8am CEST = `0 6 * * *`

Actualiza el campo `crons` en tu `wrangler.jsonc` y vuelve a hacer deploy.

---

## Errores de Notion

### `Could not find database`
**¿Qué significa?** El ID de la base de datos está mal, o la integración no tiene acceso a ella.

**Solución:**
1. Abre tu base de datos en Notion (en el navegador)
2. La URL tiene este formato: `notion.so/tu-workspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=...`
3. El ID es la parte de 32 caracteres entre la última `/` y el `?`
4. En Notion, haz clic en `···` → `Connect to` → selecciona tu integración

---

### `validation_error` en Notion
**¿Qué significa?** Las propiedades que el agente intenta crear no existen en tu base de datos.

**Solución:**
Tu base de datos debe tener estas columnas (con estos nombres y tipos exactos):
- `Name` → tipo **Title** (viene por defecto)
- `Fecha` → tipo **Date**
- `Etiquetas` → tipo **Multi-select** (opcional)
- `URL` → tipo **URL** (opcional)

Agrégalas si no existen y vuelve a intentar.

---

## Error no está en esta lista

1. **Copia el mensaje de error completo** (todo lo que aparece en rojo)
2. **Dile a Claude Code:** "Me sale este error: [pega el error]"
3. Si Claude Code no puede resolverlo: comparte el error en la comunidad

👥 **Comunidad:** https://skool.com/akroia
