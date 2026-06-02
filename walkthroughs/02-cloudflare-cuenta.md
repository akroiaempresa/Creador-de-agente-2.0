# 02 — Cuenta de Cloudflare

## ¿Qué es Cloudflare?

Cloudflare es una empresa que renta servidores en internet.
Tu agente va a "vivir" en sus servidores — ellos lo despiertan a la hora que programaste,
lo corren, y lo vuelven a dormir. Tú no tienes que hacer nada.

**¿Por qué Cloudflare y no otro?**
- El plan gratuito incluye 100,000 ejecuciones al día (más que suficiente para agentes personales)
- No necesitas tarjeta de crédito para empezar
- Es muy confiable — lo usan millones de empresas grandes

---

## Paso 1 — Crear tu cuenta

1. Ve a **https://cloudflare.com**
2. Haz clic en **"Sign Up"** (arriba a la derecha)
3. Llena el formulario:
   - Email: el tuyo
   - Password: una contraseña segura
4. Haz clic en **"Create Account"**
5. Cloudflare te manda un email de verificación — ábrelo y haz clic en el link de confirmación

---

## Paso 2 — Elegir el plan gratuito

Después de verificar tu email, Cloudflare puede preguntarte qué plan quieres.

- Selecciona **"Free"** (el gratuito)
- Haz clic en **"Continue"**

Si te pide agregar un dominio o sitio web: busca un botón que diga **"Skip"** o **"Add later"** — no necesitas un dominio para crear agentes.

---

## Paso 3 — Obtener tu API Token

El API Token es la "llave de acceso" que le permite a tu computadora subir
el agente a Cloudflare. Es diferente a tu contraseña — es una llave técnica
generada especialmente para este propósito.

1. En el dashboard de Cloudflare, haz clic en tu foto o inicial arriba a la derecha
2. Selecciona **"My Profile"**
3. En el menú izquierdo, haz clic en **"API Tokens"**
4. Haz clic en el botón azul **"Create Token"**
5. Busca la plantilla **"Edit Cloudflare Workers"** y haz clic en **"Use template"**
6. En la pantalla siguiente, deja todo como está y baja hasta el botón **"Continue to summary"**
7. Haz clic en **"Create Token"**
8. Verás tu token — es una cadena larga de letras y números

> ⚠️ **Este token solo se muestra UNA vez.** Guárdalo en un lugar seguro ahora.
> Si lo pierdes, puedes crear uno nuevo repitiendo estos pasos.

---

## Paso 4 — Guardar el token de forma segura

**NO lo pegues en el chat.** Ábrelo en tu archivo `.dev.vars` y agrégalo así:

```ini
CLOUDFLARE_API_TOKEN=pega-aqui-tu-token
```

O bien, cuando uses `wrangler login` más adelante, el proceso es automático
(abre el navegador y tú autorizas con un clic — sin copiar el token manualmente).

---

## Paso 5 — Anotar tu Account ID

El Account ID lo vas a necesitar para configurar el `wrangler.jsonc`.

1. En el dashboard de Cloudflare, mira la columna derecha
2. Ahí dice **"Account ID"** — es un código de 32 caracteres
3. Haz clic en **"Click to copy"** y guárdalo

---

## Verificación

✅ Creaste tu cuenta y verificaste el email
✅ Tienes tu API Token guardado
✅ Tienes tu Account ID anotado

Con esto Cloudflare está listo. El siguiente paso es crear tu cuenta de OpenAI.

---

## Problemas comunes

**No encuentro el email de verificación**
→ Revisa la carpeta de spam. Si no está, en el login de Cloudflare hay un botón para reenviar el email.

**Me pide tarjeta de crédito**
→ El plan Free no la requiere. Si te lo pide, busca el link que dice "Skip" o "Free plan" —
puede estar en letra pequeña debajo del formulario de pago.

**No veo "API Tokens" en mi perfil**
→ Asegúrate de estar en "My Profile" (tu perfil personal) y no en la configuración de un dominio.
El link directo es: **https://dash.cloudflare.com/profile/api-tokens**
