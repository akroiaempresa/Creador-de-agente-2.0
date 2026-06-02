# 03 — Cuenta de OpenAI

## ¿Qué es OpenAI?

OpenAI es la empresa que creó ChatGPT. Tu agente usa su tecnología
para leer, entender y resumir información — es el "cerebro" del agente.

A diferencia de ChatGPT (que tiene plan gratuito y de pago mensual),
aquí usas la **API** — pagas solo por lo que usas, sin suscripción.

**¿Cuánto cuesta en la práctica?**
Un agente que corre una vez al día y resume 10 artículos gasta aproximadamente
**$0.01 - $0.05 USD por día** usando el modelo `gpt-4o-mini`.
Con $5 de crédito tienes para varios meses.

---

## Paso 1 — Crear tu cuenta

1. Ve a **https://platform.openai.com**
   (No es ChatGPT — es la la plataforma para desarrolladores)
2. Haz clic en **"Sign up"**
3. Puedes registrarte con tu email, Google o Microsoft
4. Sigue el proceso de verificación que te pida (email o celular)

---

## Paso 2 — Agregar crédito

La API requiere que tengas saldo. Con $5 USD tienes suficiente para empezar.

1. Una vez dentro, haz clic en tu foto arriba a la derecha → **"Billing"**
   O ve directo a: **https://platform.openai.com/settings/organization/billing**
2. Haz clic en **"Add payment method"**
3. Agrega tu tarjeta (débito o crédito)
4. Haz clic en **"Add funds"** y pon **$5** (el mínimo)
5. Confirma el pago

> 💡 **Tip:** Puedes configurar un límite de gasto mensual para que nunca te cobre
> más de lo que quieres. Está en la misma sección de Billing → "Usage limits".
> Ponlo en $5-10 al mes para estar tranquilo.

---

## Paso 3 — Crear tu API Key

El API Key es la "llave de acceso" que tu agente usa para pedirle resúmenes a OpenAI.

1. En el menú izquierdo, haz clic en **"API keys"**
   O ve directo a: **https://platform.openai.com/api-keys**
2. Haz clic en el botón **"+ Create new secret key"**
3. En el campo "Name" escribe algo descriptivo: `mi-agente-cloudflare`
4. Deja las demás opciones como están
5. Haz clic en **"Create secret key"**
6. Verás tu key — empieza con `sk-...`

> ⚠️ **Esta key solo se muestra UNA vez.** Cópiala ahora mismo.
> Si la pierdes, tendrás que crear una nueva (la anterior queda inválida).

---

## Paso 4 — Guardar la key de forma segura

**NO la pegues en el chat.** Ábrela directamente en tu archivo `.dev.vars`:

```ini
OPENAI_API_KEY=sk-proj-...tu-key-completa-aqui...
```

Guarda el archivo.

---

## Paso 5 — Verificar que el crédito está disponible

1. Ve a **https://platform.openai.com/usage**
2. Debes ver tu saldo disponible en la sección "Credit balance"
3. Si ves $5.00 (o lo que pusiste): ✅ listo

---

## Verificación final

✅ Tienes cuenta en platform.openai.com (no en chatgpt.com)
✅ Tienes crédito cargado ($5 mínimo)
✅ Tu API Key está guardada en `.dev.vars`
✅ la key empieza con `sk-`

Con esto OpenAI está listo. Tu agente ya tiene cerebro.

---

## Problemas comunes

**No encuentro "API keys" en el menú**
→ Asegúrate de estar en **platform.openai.com** y no en **chatgpt.com**.
Son sitios diferentes. El link directo es: https://platform.openai.com/api-keys

**Me pide verificar con número de celular**
→ Es un paso de seguridad normal. Usa tu número real, solo sirve para verificar una vez.

**Error `429` cuando el agente corre**
→ Significa que se acabó el crédito o llegaste al límite de uso.
Ve a Billing → Add funds para recargar.

**Error `401 - Invalid API Key`**
→ la key fue copiada incompleta o tiene espacios extra.
Crea una nueva key y cópiala de nuevo con cuidado.

**¿Puedo usar GPT-4 en lugar de GPT-4o mini?**
→ Sí, pero cuesta ~20x más. GPT-4o mini es suficiente para resumir noticias,
monitorear sitios y la mayoría de tareas de agentes. Empieza con ese.
