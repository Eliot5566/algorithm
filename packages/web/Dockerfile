# syntax=docker/dockerfile:1.5
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY package.json pnpm-workspace.yaml tsconfig.base.json .eslintrc.cjs .prettierrc.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/web/package.json packages/web/

RUN pnpm install --frozen-lockfile --filter @unified-inbox/shared --filter @unified-inbox/web...

COPY packages/shared packages/shared
COPY packages/web packages/web

RUN pnpm --filter @unified-inbox/shared build
RUN pnpm --filter @unified-inbox/web build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/web/.next/standalone ./
COPY --from=base /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=base /app/packages/web/public ./packages/web/public

WORKDIR /app

EXPOSE 3000
CMD ["node", "server.js"]
