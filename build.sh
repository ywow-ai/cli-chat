#!/bin/bash

echo "🔨 Building server..."
bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile ./build/server \
  ./src/index.ts

echo "🔨 Building client..."
bun build \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile ./public/generated/client.js \
  ./src/client.ts

echo "✅ Build complete!"
