# Stage 1: Builder
FROM node:20-alpine as development

WORKDIR /app

# Копируем только зависимости для кэширования
COPY server/package*.json ./
RUN npm ci --only=development --save --legacy-peer-deps

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
COPY --from=development /app/dist ./dist
COPY --from=development /app/package*.json ./
COPY --from=development /app/prisma ./prisma

RUN npm install --only=production

# Очистка кэша
RUN npm cache clean --force

RUN npx prisma generate

ARG NODE_ENV=production
ARG PORT
ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}

CMD ["pm2-runtime", "dist/main.js"]

EXPOSE $PORT