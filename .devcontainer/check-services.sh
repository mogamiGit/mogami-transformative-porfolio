#!/usr/bin/env bash
set -euo pipefail

echo "=== Dev Container Health Check ==="
echo ""

# Detect environment
if [ -n "${CODESPACE_NAME:-}" ]; then
  echo "Environment: GitHub Codespaces"
elif [ -n "${REMOTE_CONTAINERS:-}" ]; then
  echo "Environment: VS Code Dev Container"
else
  echo "Environment: Local / Unknown"
fi
echo ""

# Node.js
if command -v node &>/dev/null; then
  echo "✅ Node.js: $(node --version)"
else
  echo "❌ Node.js: not found"
fi

# pnpm
if command -v pnpm &>/dev/null; then
  echo "✅ pnpm: $(pnpm --version)"
else
  echo "❌ pnpm: not found"
fi

# Claude CLI
if command -v claude &>/dev/null; then
  echo "✅ Claude CLI: available"
else
  echo "⚠️  Claude CLI: not found"
fi

echo ""
echo "=== Port Status ==="
if command -v netstat &>/dev/null; then
  netstat -tlnp 2>/dev/null | grep -E ':(3000)' || echo "  (no ports open yet)"
else
  echo "  (netstat not available)"
fi

echo ""
echo "=== Ready ==="
echo "Run 'pnpm dev' to start the development server."
echo "To rebuild: CMD+SHIFT+P → 'Dev Containers: Rebuild Container'"
