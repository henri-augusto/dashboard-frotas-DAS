# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./dev.db"

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

FROM base AS prisma-cli
WORKDIR /cli
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:/data/app.db"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs \
  && mkdir -p /data /cli \
  && chown nextjs:nodejs /data

COPY --from=prisma-cli --chown=nextjs:nodejs /cli/node_modules /cli/node_modules
COPY --from=prisma-cli --chown=nextjs:nodejs /cli/prisma /cli/prisma
COPY --from=prisma-cli --chown=nextjs:nodejs /cli/package.json /cli/package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/pdfkit ./node_modules/pdfkit
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nextjs
EXPOSE 7000

ENTRYPOINT ["docker-entrypoint.sh"]
