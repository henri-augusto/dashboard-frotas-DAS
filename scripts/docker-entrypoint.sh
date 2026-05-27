#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-file:/data/app.db}"

cd /cli
node ./node_modules/prisma/build/index.js generate
node ./node_modules/prisma/build/index.js db push --skip-generate

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
  node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts
fi

cd /app
exec node server.js
