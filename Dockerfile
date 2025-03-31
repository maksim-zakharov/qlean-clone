# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем только зависимости для кэширования
COPY server/package*.json ./
RUN npm ci --production

# Копируем остальные файлы и билдим
COPY server/ .
RUN npm run build:ci

# Stage 2: Runner
FROM node:20-alpine as production
WORKDIR /app

RUN npm install pm2 -g;

ENV TZ=Europe/Moscow
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Копируем только необходимое
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Очистка кэша
RUN npm cache clean --force

ARG NODE_ENV=production
#ARG PORT
#ARG DATABASE_URL
#ARG SHADOW_DATABASE_URL
#ARG PM2_PUBLIC_KEY
#ARG PM2_SECRET_KEY
#
ENV NODE_ENV=${NODE_ENV}
#ENV PORT=${PORT}
#ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
#ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}
#ENV DATABASE_URL=${DATABASE_URL}
#ENV SHADOW_DATABASE_URL=${SHADOW_DATABASE_URL}

RUN npx prisma generate

EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]