# syntax=docker/dockerfile:1.5
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY package.json pnpm-workspace.yaml tsconfig.base.json .eslintrc.cjs .prettierrc.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

RUN pnpm install --frozen-lockfile --filter @unified-inbox/shared --filter @unified-inbox/api...

COPY packages/shared packages/shared
COPY packages/api packages/api

RUN pnpm --filter @unified-inbox/shared build
RUN pnpm --filter @unified-inbox/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/api/dist ./dist
COPY packages/api/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/index.js"]
