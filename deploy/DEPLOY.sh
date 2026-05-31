#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=== JRW Finance - Deploy both portals to Netlify ==="
echo "Make sure you are logged in: npx netlify-cli login"
read -p "Continue? [y/N] " yn
[ "$yn" = "y" ] || exit 0

echo "--- Deploying broker admin ---"
( cd "$DIR/broker-admin" && npx -y netlify-cli@latest deploy --prod --dir . --site 07baf1be-f624-4dcb-ab41-f0092ed1da02 )

echo "--- Deploying client portal ---"
( cd "$DIR/client-portal" && npx -y netlify-cli@latest deploy --prod --dir . --site 12ea9a97-6846-41c7-98b0-cb5f87d2a93c )

echo "=== Both sites deployed ==="
