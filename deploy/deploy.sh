#!/usr/bin/env bash
# Run on the VPS from /home/ubuntu/portfolio: pull the latest image and restart.
set -euo pipefail
cd "$(dirname "$0")"
docker compose pull
docker compose up -d
docker image prune -f >/dev/null
docker compose ps
