# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

# Instala dependências (camada cacheável; invalida só quando lock/package mudam)
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma/schema.prisma prisma/schema.prisma
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Build da aplicação (sem migração de banco — isso roda no entrypoint em runtime)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs middleware.ts ./
COPY prisma ./prisma
COPY public ./public
COPY app ./app
COPY components ./components
COPY lib ./lib

RUN npx prisma generate
RUN npm run build

# CLI mínima para migrate/seed em runtime (sem devDependencies do projeto)
FROM base AS migrator
WORKDIR /cli
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts && \
    npm install --no-save prisma@^6.8.2 tsx@^4.19.4 && \
    npm cache clean --force

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=7000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=migrator --chown=nextjs:nodejs /cli /cli
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/pdfkit ./node_modules/pdfkit
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 7000

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:7000/',(r)=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
