#!/usr/bin/env bash
# Run on the VPS from /home/ubuntu/portfolio: pull the image and (re)start.
set -euo pipefail
cd "$(dirname "$0")"

TAG="$(grep -E '^PORTFOLIO_TAG=' .env | cut -d= -f2- || true)"
IMAGE="ghcr.io/vicenteqa/portfolio:${TAG:-latest}"

# The package is public, so pull with an empty Docker config. The VPS-wide
# ghcr login (used for private images) is sent otherwise, and if it has
# expired ghcr answers "denied" even for public images.
DOCKER_CONFIG="$(mktemp -d)" docker pull "$IMAGE"

docker compose up -d
docker image prune -f >/dev/null
docker compose ps
