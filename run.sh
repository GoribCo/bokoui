#!/usr/bin/env bash
# Build + publish bokoui to local Verdaccio, then run every example concurrently.
#
#   ./run.sh              publish (auto-bumping the patch version if already published), then run examples
#   ./run.sh --no-publish skip build/publish, just install and run examples
#
# Ctrl+C stops all examples.
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
cleanup() {
  echo; echo "Stopping examples..."
  for pid in "${PIDS[@]:-}"; do [ -n "$pid" ] && kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

for dir in "$ROOT"/examples/*/; do
  [ -f "$dir/package.json" ] || continue
  name="$(basename "$dir")"
  (
    cd "$dir"
    if [ "$publish" = 1 ]; then
      npm pkg set "dependencies.bokoui=^$VERSION" >/dev/null
      npm install --no-audit --no-fund
    else
      [ -d node_modules ] || npm install --no-audit --no-fund
    fi
    exec npm run dev
  ) 2>&1 | sed -u "s/^/[$name] /" &
  PIDS+=($!)
done

[ "${#PIDS[@]}" -gt 0 ] || { echo "No examples found in $ROOT/examples" >&2; exit 1; }
wait
