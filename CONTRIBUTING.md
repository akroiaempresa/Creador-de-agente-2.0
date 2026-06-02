# Cómo Contribuir

¡Gracias por querer mejorar este skill! Cualquier contribución es bienvenida,
desde corregir un typo hasta agregar un nuevo fragment de integración.

---

## Formas de contribuir

### 🐛 Reportar un bug
1. Abre un **Issue** en GitHub
2. Incluye el error exacto (cópialo completo)
3. Describe qué estabas haciendo cuando ocurrió
4. Menciona tu sistema operativo y versión de Node.js (`node --version`)

### 💡 Sugerir una mejora
1. Abre un **Issue** con el prefijo `[sugerencia]` en el título
2. Explica qué problema resuelve tu idea
3. Si tienes código, abre un Pull Request

### 🔧 Enviar un Pull Request

1. **Fork** este repositorio
2. Crea una rama descriptiva:
   ```bash
   git checkout -b fix/error-yaml-frontmatter
   git checkout -b feat/fragment-google-sheets
   ```
3. Haz tus cambios
4. Verifica que el código de TypeScript compila:
   ```bash
   npx tsc --noEmit
   ```
5. Haz commit con un mensaje claro en español o inglés:
   ```
   fix: corregir error YAML en frontmatter de SKILL.md
   feat: agregar fragment para guardar en Google Sheets
   docs: mejorar walkthrough de Pushover
   ```
6. Abre el Pull Request describiendo qué cambiaste y por qué

---

## Guía de estilo

### Para el SKILL.md
- Lenguaje LATAM, neutro, sin tecnicismos sin traducir
- Las instrucciones para Claude usan **negrita** para reglas duras
- Los ejemplos de diálogo van en bloques de código con triple backtick
- Cada fase comienza con una frase de contexto para el usuario

### Para los blueprints y fragments (TypeScript)
- Comentarios en **español** para todo lo que no sea obvio
- Nombres de variables y funciones en **camelCase en español** cuando sea posible
  (ej: `resumirConIA`, `notificarPushover`, `guardarEnNotion`)
- Validaciones al inicio de cada función (fail fast con mensajes en español)
- Manejo explícito de errores — nunca dejar un `catch` vacío
- Tipado completo — no usar `any`

### Para los walkthroughs
- Un archivo por servicio/tema
- Estructura: título → qué es → por qué se necesita → pasos → verificación
- Los pasos usan números, no bullets
- Incluir descripción de lo que el usuario verá en pantalla ("vas a ver un botón azul que dice...")

---

## Tipos de contribuciones prioritarias

Estas son las áreas donde más se necesita ayuda:

| Área | Descripción |
|------|-------------|
| 🔌 Nuevos fragments | Google Sheets, Telegram, Slack, Airtable, Discord |
| 📖 Walkthroughs | Mejorar los existentes con más detalle en las capturas |
| 🌎 Localizaciones | Adaptar referencias a plataformas populares en otros países |
| 🧪 Ejemplos | Nuevos agentes completos en la carpeta `examples/` |
| 🐛 Bug fixes | Errores reportados en Issues |

---

## Preguntas

Si tienes dudas sobre cómo contribuir, abre un Issue o pregunta en la comunidad:
👥 https://skool.com/horizontes-ia
