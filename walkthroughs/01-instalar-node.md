# 01 — Instalar Node.js

## ¿Qué es Node.js?

Node.js es el programa que permite que tu computadora entienda y corra
el código de tu agente. Sin él, nada funciona.

Es gratuito, oficial y seguro — lo mantiene la misma fundación detrás de buena parte de internet.

## ¿Por qué lo necesitamos?

Tu agente está escrito en TypeScript (un lenguaje de programación).
Node.js es el que "traduce" ese código para que tu computadora lo entienda
y para que las herramientas de Cloudflare puedan funcionar.

---

## Instalación en Windows

### Paso 1 — Descargar

1. Ve a **https://nodejs.org**
2. Vas a ver dos botones grandes. Haz clic en el que dice **"LTS"**
   (LTS significa "Long Term Support" — la versión más estable y recomendada)
3. Se descarga un archivo `.msi` — ábrelo cuando termine

### Paso 2 — Instalar

1. Se abre un asistente de instalación. Haz clic en **"Next"** en todas las pantallas
2. En la pantalla que dice **"Tools for Native Modules"** — **NO marques** la casilla extra
3. Haz clic en **"Install"**
4. Cuando termine, haz clic en **"Finish"**

### Paso 3 — Verificar

1. Cierra cualquier terminal que tengas abierta (importante)
2. Abre una nueva: presiona `Windows + R`, escribe `cmd`, presiona Enter
3. Escribe este comando y presiona Enter:
   ```
   node --version
   ```
4. Debes ver algo como `v22.x.x` o `v20.x.x`

✅ Si ves el número de versión: Node.js está instalado correctamente.
❌ Si ves `'node' is not recognized`: cierra y vuelve a abrir la terminal e intenta de nuevo.

---

## Instalación en macOS

### Opción A — Descarga directa (más fácil)

1. Ve a **https://nodejs.org**
2. Haz clic en el botón **"LTS"**
3. Se descarga un `.pkg` — ábrelo y sigue el asistente (Next → Next → Install)
4. Abre la **Terminal** (búscala en Spotlight con `Cmd + Espacio` → escribe "Terminal")
5. Escribe:
   ```bash
   node --version
   ```
6. Debes ver `v22.x.x` o similar ✅

### Opción B — Con Homebrew (si ya lo tienes)

```bash
brew install node@22
```

---

## Instalación en Linux (Ubuntu / Debian)

```bash
# Agregar el repositorio oficial de Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Instalar
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

---

## Verificación final (todos los sistemas)

Corre estos dos comandos. Ambos deben devolver un número de versión:

```bash
node --version
# Esperado: v20.x.x o mayor

npm --version
# Esperado: 10.x.x o mayor
```

Si los dos funcionan: **listo, puedes continuar al siguiente paso.**

---

## Problemas comunes

**`node` no se reconoce después de instalar (Windows)**
→ Cierra TODAS las ventanas de terminal y ábrelas de nuevo.
Si sigue sin funcionar, reinicia la computadora.

**No veo el botón LTS en nodejs.org**
→ El sitio puede cambiar su diseño. Busca cualquier versión que diga "20" o "22" en el número.

**Tengo Node pero la versión es muy vieja (v14, v16)**
→ Descarga la versión LTS nueva desde nodejs.org e instala encima — reemplaza la anterior automáticamente.
