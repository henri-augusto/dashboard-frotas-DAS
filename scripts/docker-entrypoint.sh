#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-file:/data/app.db}"

cd /cli
npx --yes prisma generate
npx --yes prisma db push --skip-generate

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
  npx --yes tsx prisma/seed.ts
fi

cd /app
exec node server.js
