FROM node:18-alpine AS builder

ARG DATABASE_URL
ARG SHADOW_DATABASE_URL

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=""
ENV SHADOW_DATABASE_URL=""

COPY --from=builder /app/package*.json ./
RUN npm ci --production

# Копируем зависимости, Pr-клиент и билд
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# Копируем схему Prisma
COPY --from=builder /app/prisma ./prisma

# Генерируем Prisma Client для продакшена
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/main.js"]