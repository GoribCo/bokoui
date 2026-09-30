#!/usr/bin/env bash
# Build + publish bokoui to local Verdaccio, then run every example concurrently.
#
#   ./run.sh              publish (auto-bumping the patch version if already published), then run examples
#   ./run.sh --no-publish skip build/publish, just install and run examples
#
# Ports are fixed so the React / Vue / Expo switcher in each example can link to the others:
#   expo-js 3000, next-js 3001, nuxt-js 3002, next-js-layouts 3003 (any other example: 3010 and up).
# Override with BOKOUI_PORT_EXPO / _REACT / _VUE. Ctrl+C stops all examples.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
PKG="$ROOT/packages/bokoui"
REGISTRY="$(sed -n 's/^registry=//p' "$PKG/.npmrc")"
REGISTRY="${REGISTRY%/}"

publish=1
[ "${1:-}" = "--no-publish" ] && publish=0

if [ "$publish" = 1 ]; then
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
  VERSION="$(node -p "require('./package.json').version")"
fi

# Install each example (pointing it at the latest published version) and start it.
PIDS=()
PORT_EXPO="${BOKOUI_PORT_EXPO:-3000}"
PORT_REACT="${BOKOUI_PORT_REACT:-3001}"
PORT_VUE="${BOKOUI_PORT_VUE:-3002}"
PORT_LAYOUTS=3003

# Where each platform's demo lives, for the switcher. Every example reads the variable with its
# own prefix (NEXT_PUBLIC_, NUXT_PUBLIC_, EXPO_PUBLIC_) and falls back to the same defaults.
export NEXT_PUBLIC_BOKOUI_URL_REACT="http://localhost:$PORT_REACT" NEXT_PUBLIC_BOKOUI_URL_VUE="http://localhost:$PORT_VUE" NEXT_PUBLIC_BOKOUI_URL_EXPO="http://localhost:$PORT_EXPO"
export NUXT_PUBLIC_URL_REACT="$NEXT_PUBLIC_BOKOUI_URL_REACT" NUXT_PUBLIC_URL_VUE="$NEXT_PUBLIC_BOKOUI_URL_VUE" NUXT_PUBLIC_URL_EXPO="$NEXT_PUBLIC_BOKOUI_URL_EXPO"
export EXPO_PUBLIC_BOKOUI_URL_REACT="$NEXT_PUBLIC_BOKOUI_URL_REACT" EXPO_PUBLIC_BOKOUI_URL_VUE="$NEXT_PUBLIC_BOKOUI_URL_VUE" EXPO_PUBLIC_BOKOUI_URL_EXPO="$NEXT_PUBLIC_BOKOUI_URL_EXPO"

port_for() {
  case "$1" in
    expo-js) echo "$PORT_EXPO" ;;
    next-js) echo "$PORT_REACT" ;;
    nuxt-js) echo "$PORT_VUE" ;;
    next-js-layouts) echo "$PORT_LAYOUTS" ;;
    *) echo $((3010 + ${#PIDS[@]})) ;;
  esac
}
cleanup() {
  echo; echo "Stopping examples..."
  for pid in "${PIDS[@]:-}"; do [ -n "$pid" ] && kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

for dir in "$ROOT"/examples/*/; do
  [ -f "$dir/package.json" ] || continue
  name="$(basename "$dir")"
  port="$(port_for "$name")"
  echo "[$name] will listen on http://localhost:$port"
  (
    export PORT="$port"
    cd "$dir"
    if [ "$publish" = 1 ]; then
      npm pkg set "dependencies.bokoui=^$VERSION" >/dev/null
      npm install --no-audit --no-fund
    else
      [ -d node_modules ] || npm install --no-audit --no-fund
    fi
    # A stale Next.js cache (from an earlier run, a `next build`, or a reinstalled bokoui) can
    # remember "Can't resolve 'bokoui/styles.css'" and keep failing. Start from a clean one.
    rm -rf .next
    exec npm run dev
  ) 2>&1 | sed -u "s/^/[$name] /" &
  PIDS+=($!)
done

[ "${#PIDS[@]}" -gt 0 ] || { echo "No examples found in $ROOT/examples" >&2; exit 1; }
wait
