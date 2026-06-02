#!/usr/bin/env bash
# install.sh — Instala el skill "crear-agente" en Claude Code
# Uso: curl -fsSL https://raw.githubusercontent.com/TU_USUARIO/crear-agente/main/install.sh | bash

set -euo pipefail

SKILL_NAME="crear-agente"
REPO_URL="https://github.com/TU_USUARIO/crear-agente.git"
TARGET="$HOME/.claude/skills/$SKILL_NAME"
CLAUDE_DIR="$HOME/.claude"

# ── Colores ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # Sin color

info()    { echo -e "${CYAN}  →${NC} $1"; }
ok()      { echo -e "${GREEN}  ✓${NC} $1"; }
warn()    { echo -e "${YELLOW}  ⚠${NC} $1"; }
error()   { echo -e "${RED}  ✗${NC} $1"; }

# ── Banner ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN} ┌─────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN} │  Instalador: skill 'crear-agente'               │${NC}"
echo -e "${CYAN} │  Para Claude Code — v1.1.0                      │${NC}"
echo -e "${CYAN} └─────────────────────────────────────────────────┘${NC}"
echo ""

# ── Detectar OS ──────────────────────────────────────────────────────────────
OS_TYPE="$(uname -s 2>/dev/null || echo "unknown")"
case "$OS_TYPE" in
  Darwin) ok "Sistema: macOS" ;;
  Linux)  ok "Sistema: Linux" ;;
  *)      warn "Sistema no reconocido: $OS_TYPE (continuando de todas formas)" ;;
esac

# ── Verificar Git ─────────────────────────────────────────────────────────────
if ! command -v git &>/dev/null; then
  error "Git no está instalado."
  echo ""
  echo "  Instálalo desde: https://git-scm.com"
  echo "  En macOS también puedes correr: xcode-select --install"
  exit 1
fi
ok "Git: $(git --version | head -1)"

# ── Verificar Node.js ─────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  error "Node.js no está instalado."
  echo ""
  echo "  Instálalo desde: https://nodejs.org (versión LTS recomendada)"
  exit 1
fi

NODE_VERSION="$(node --version | tr -d 'v')"
NODE_MAJOR="${NODE_VERSION%%.*}"

if [ "$NODE_MAJOR" -lt 20 ]; then
  warn "Node.js $NODE_VERSION detectado — se recomienda v20 o mayor."
  warn "Actualiza en: https://nodejs.org"
  read -rp "  ¿Continuar de todas formas? (s/n): " CONTINUAR
  if [[ ! "$CONTINUAR" =~ ^[Ss]$ ]]; then
    echo "  Instalación cancelada."
    exit 0
  fi
else
  ok "Node.js v$NODE_VERSION"
fi

# ── Verificar Claude Code ─────────────────────────────────────────────────────
if [ ! -d "$CLAUDE_DIR" ]; then
  error "No encontré la carpeta ~/.claude"
  echo ""
  echo "  ¿Tienes Claude Code instalado?"
  echo "  Instálalo desde: https://claude.ai/code"
  exit 1
fi
ok "Claude Code detectado en $CLAUDE_DIR"

# ── Crear carpeta de skills ───────────────────────────────────────────────────
SKILLS_DIR="$CLAUDE_DIR/skills"
mkdir -p "$SKILLS_DIR"

# ── ¿Ya existe el skill? ──────────────────────────────────────────────────────
if [ -d "$TARGET" ]; then
  echo ""
  warn "Ya tienes '$SKILL_NAME' instalado en $TARGET"
  read -rp "  ¿Actualizarlo a la última versión? (s/n): " ACTUALIZAR
  if [[ ! "$ACTUALIZAR" =~ ^[Ss]$ ]]; then
    echo "  Instalación cancelada. Tu skill actual queda intacta."
    exit 0
  fi
  info "Removiendo versión anterior..."
  rm -rf "$TARGET"
fi

# ── Clonar ────────────────────────────────────────────────────────────────────
echo ""
info "Descargando skill desde GitHub..."

TMP_DIR="$(mktemp -d)"
TMP_REPO="$TMP_DIR/crear-agente"

# Limpiar temp al salir (incluso si falla)
trap 'rm -rf "$TMP_DIR"' EXIT

git clone --depth 1 --quiet "$REPO_URL" "$TMP_REPO"

# Quitar el .git para que la carpeta quede limpia
rm -rf "$TMP_REPO/.git"

mv "$TMP_REPO" "$TARGET"

ok "Skill instalado en: $TARGET"

# ── Mensaje final ─────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN} ┌─────────────────────────────────────────────────┐${NC}"
echo -e "${GREEN} │  🎉 INSTALACIÓN COMPLETA                        │${NC}"
echo -e "${GREEN} └─────────────────────────────────────────────────┘${NC}"
echo ""
echo "  Para crear tu primer agente:"
echo ""
echo "  1. Abre (o reinicia) Claude Code"
echo "  2. Escribe: /crear-agente"
echo "     o describe qué quieres: 'quiero automatizar [algo]'"
echo "  3. Claude te guiará paso a paso"
echo ""
echo "  La primera vez tarda ~45-60 min."
echo "  Los siguientes agentes: ~15 min."
echo ""
echo "  Si algo no funciona: walkthroughs/99-troubleshooting.md"
echo "  Comunidad: https://skool.com/horizontes-ia"
echo ""
