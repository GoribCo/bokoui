#!/usr/bin/env bash
# Publish packages/bokoui to the local Verdaccio registry.
#
#   npm run publish:local   (from packages/bokoui, or examples/next-js)
#
# Steps: start Verdaccio if it is down, log in (registering the dev user on first
# run), build, publish. Override credentials with VERDACCIO_USER / VERDACCIO_PASS /
# VERDACCIO_EMAIL. Bump the version first (npm version patch) to publish again.
set -euo pipefail

PKG="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$(sed -n 's/^registry=//p' "$PKG/.npmrc")"
REGISTRY="${REGISTRY%/}"
HOST="${REGISTRY#http://}"
USER_NAME="${VERDACCIO_USER:-bokoui-dev}"
PASS="${VERDACCIO_PASS:-bokoui-local-dev}"
EMAIL="${VERDACCIO_EMAIL:-bokoui-dev@localhost}"

[ -n "$REGISTRY" ] || { echo "No registry= line in $PKG/.npmrc" >&2; exit 1; }

# 1. Verdaccio up?
if ! curl -fs -m 3 "$REGISTRY/-/ping" >/dev/null; then
  echo "Verdaccio not reachable at $REGISTRY, starting it on $HOST..."
  # Bind to the exact host from .npmrc; the default "localhost" can resolve to IPv6 ::1 only.
  nohup verdaccio --listen "$HOST" >/tmp/verdaccio.log 2>&1 &
  for _ in $(seq 1 20); do
    curl -fs -m 2 "$REGISTRY/-/ping" >/dev/null && break
    sleep 1
  done
  curl -fs -m 2 "$REGISTRY/-/ping" >/dev/null || { echo "Verdaccio failed to start, see /tmp/verdaccio.log" >&2; exit 1; }
fi
echo "Verdaccio OK at $REGISTRY"

# 2. Logged in? If not, register/login and store the token for this registry only (~/.npmrc).
if ! (cd "$PKG" && npm whoami >/dev/null 2>&1); then
  echo "Logging in as $USER_NAME..."
  RESPONSE="$(curl -s -m 10 -X PUT "$REGISTRY/-/user/org.couchdb.user:$USER_NAME" \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"$USER_NAME\",\"password\":\"$PASS\",\"email\":\"$EMAIL\",\"type\":\"user\"}")"
  TOKEN="$(printf '%s' "$RESPONSE" | tr -d '\n' | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
  [ -n "$TOKEN" ] || { echo "Login failed: $RESPONSE" >&2; exit 1; }
  npm config set "//$HOST/:_authToken" "$TOKEN" --location=user
fi
echo "Publishing as: $(cd "$PKG" && npm whoami)"

# 3. Build + publish (prepublishOnly runs the build).
cd "$PKG"
npm publish --registry "$REGISTRY"

VERSION="$(node -p "require('./package.json').version")"
echo
echo "Published bokoui@$VERSION to $REGISTRY"
echo "Install elsewhere:  echo 'registry=$REGISTRY/' > .npmrc && npm i bokoui"
