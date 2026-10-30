#!/usr/bin/env bash
# Build + publish bokoui to local Verdaccio, then run every example concurrently.
#
#   ./run.sh build   build + publish the library to Verdaccio (bumps the patch version if already published), then stop
#   ./run.sh show    install the last built version into every example and run them all
#   ./run.sh         both: build, then show
#
# examples/showcase (plain HTML) is served on 3000.
# Ports are fixed so the React / Vue / Expo switcher in each example can link to the others:
#   expo-js 3001, next-js 3002, nuxt-js 3003, next-js-layouts 3004, expo-js-layouts 3005, nuxt-js-layouts 3006 (any other example: 3010 and up).
# Override with BOKOUI_PORT_EXPO / _REACT / _VUE. Ctrl+C stops all examples.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PKG="$ROOT/packages/bokoui"
REGISTRY="$(sed -n 's/^registry=//p' "$PKG/.npmrc")"
REGISTRY="${REGISTRY%/}"

MODE="${1:-all}"
case "$MODE" in build|show|all) ;; *) echo "Usage: ./run.sh [build|show]" >&2; exit 1 ;; esac

if [ "$MODE" != show ]; then
  cd "$PKG"
  [ -d node_modules ] || npm install

  # A registry rejects re-publishing a version, so bump if this one is already there.
  NAME="$(node -p "require('./package.json').name")"
  VERSION="$(node -p "require('./package.json').version")"
  if npm view "$NAME@$VERSION" version --registry "$REGISTRY" >/dev/null 2>&1; then
    echo "$NAME@$VERSION already published, bumping patch..."
    npm version patch --no-git-tag-version >/dev/null
  fi

  # Starts Verdaccio if down, logs in, builds (prepublishOnly), publishes.
  bash scripts/publish-local.sh
fi
[ "$MODE" = build ] && exit 0

VERSION="$(node -p "require('$PKG/package.json').version")"

# Install each example (pointing it at the latest published version) and start it.
PIDS=()
PORT_SHOWCASE=3000
PORT_EXPO="${BOKOUI_PORT_EXPO:-3001}"
PORT_REACT="${BOKOUI_PORT_REACT:-3002}"
PORT_VUE="${BOKOUI_PORT_VUE:-3003}"
PORT_LAYOUTS=3004
PORT_EXPO_LAYOUTS=3005
PORT_VUE_LAYOUTS=3006

# Where each platform's demo lives, for the switcher. Every example reads the variable with its
# own prefix (NEXT_PUBLIC_, NUXT_PUBLIC_, EXPO_PUBLIC_) and falls back to the same defaults.
export NEXT_PUBLIC_BOKOUI_URL_REACT="http://localhost:$PORT_REACT" NEXT_PUBLIC_BOKOUI_URL_VUE="http://localhost:$PORT_VUE" NEXT_PUBLIC_BOKOUI_URL_EXPO="http://localhost:$PORT_EXPO"
export NEXT_PUBLIC_BOKOUI_URL_LAYOUTS="http://localhost:$PORT_LAYOUTS" NUXT_PUBLIC_URL_LAYOUTS="http://localhost:$PORT_VUE_LAYOUTS" EXPO_PUBLIC_BOKOUI_URL_LAYOUTS="http://localhost:$PORT_EXPO_LAYOUTS"
export NUXT_PUBLIC_URL_REACT="$NEXT_PUBLIC_BOKOUI_URL_REACT" NUXT_PUBLIC_URL_VUE="$NEXT_PUBLIC_BOKOUI_URL_VUE" NUXT_PUBLIC_URL_EXPO="$NEXT_PUBLIC_BOKOUI_URL_EXPO"
export EXPO_PUBLIC_BOKOUI_URL_REACT="$NEXT_PUBLIC_BOKOUI_URL_REACT" EXPO_PUBLIC_BOKOUI_URL_VUE="$NEXT_PUBLIC_BOKOUI_URL_VUE" EXPO_PUBLIC_BOKOUI_URL_EXPO="$NEXT_PUBLIC_BOKOUI_URL_EXPO"

port_for() {
  case "$1" in
    expo-js) echo "$PORT_EXPO" ;;
    next-js) echo "$PORT_REACT" ;;
    nuxt-js) echo "$PORT_VUE" ;;
    next-js-layouts) echo "$PORT_LAYOUTS" ;;
    expo-js-layouts) echo "$PORT_EXPO_LAYOUTS" ;;
    nuxt-js-layouts) echo "$PORT_VUE_LAYOUTS" ;;
    *) echo $((3010 + ${#PIDS[@]})) ;;
  esac
}
cleanup() {
  echo; echo "Stopping examples..."
  for pid in "${PIDS[@]:-}"; do [ -n "$pid" ] && kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "[showcase] will listen on http://localhost:$PORT_SHOWCASE"
python3 -m http.server "$PORT_SHOWCASE" --directory "$ROOT/examples/showcase" 2>&1 | sed -u "s/^/[showcase] /" &
PIDS+=($!)

for dir in "$ROOT"/examples/*/; do
  [ -f "$dir/package.json" ] || continue
  name="$(basename "$dir")"
  port="$(port_for "$name")"
  echo "[$name] will listen on http://localhost:$port"
  (
    export PORT="$port"
    cd "$dir"
    npm pkg set "dependencies.bokoui=^$VERSION" >/dev/null
    npm install --no-audit --no-fund
    # A stale Next.js cache (from an earlier run, a `next build`, or a reinstalled bokoui) can
    # remember "Can't resolve 'bokoui/styles.css'" and keep failing. Start from a clean one.
    rm -rf .next
    exec npm run dev
  ) 2>&1 | sed -u "s/^/[$name] /" &
  PIDS+=($!)
done

[ "${#PIDS[@]}" -gt 0 ] || { echo "No examples found in $ROOT/examples" >&2; exit 1; }
wait
