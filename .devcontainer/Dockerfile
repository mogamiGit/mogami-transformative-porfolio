FROM node:22-alpine

# System tools
RUN apk add --no-cache git bash curl

# Claude CLI
RUN curl -fsSL https://claude.ai/install.sh | bash

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /workspace

SHELL ["/bin/bash", "-c"]

CMD ["sleep", "infinity"]
