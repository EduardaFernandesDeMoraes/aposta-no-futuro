#!/usr/bin/env sh
# Gera public/og-image.png (1200x630) a partir de scripts/og/og-home.html
# com o Chrome (ou Edge) headless. Rode a partir da raiz do repositório.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/scripts/og/og-home.html"
OUT="$ROOT/public/og-image.png"

BROWSER="${BROWSER:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
[ -x "$BROWSER" ] || BROWSER="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

# Caminhos no formato do Windows quando estiver no Git Bash.
if command -v cygpath >/dev/null 2>&1; then
  SRC_URL="file:///$(cygpath -m "$SRC")"
  OUT_ARG="$(cygpath -w "$OUT")"
else
  SRC_URL="file://$SRC"
  OUT_ARG="$OUT"
fi

"$BROWSER" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=6000 --default-background-color=16233cff \
  --screenshot="$OUT_ARG" "$SRC_URL"

echo "OK: $OUT"
