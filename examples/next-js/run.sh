#!/bin/bash
set -e

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

rm -rf .next out

PORT=3040

# sudo kill -9 $(lsof -t -i:$PORT)

# Override the development port with PORT if needed.
npm run dev -- --port "${PORT:-$PORT}"
