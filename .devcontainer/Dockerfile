# Debian-based: Playwright publishes no browser builds for musl, so Alpine
# cannot run the e2e suite.
FROM node:22-bookworm-slim

# System tools
RUN apt-get update && apt-get install -y --no-install-recommends \
      git curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Claude CLI
RUN curl -fsSL https://claude.ai/install.sh | bash

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /workspace

SHELL ["/bin/bash", "-c"]

CMD ["sleep", "infinity"]
