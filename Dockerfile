FROM node:20-alpine as development

WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build:ci

FROM node:20-alpine as production
WORKDIR /app

RUN npm install pm2 -g;

ENV TZ=Europe/Moscow
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=development /app/package*.json ./
RUN npm ci --production

# Копируем зависимости, Pr-клиент и билд
COPY --from=development /app/dist ./dist
# Копируем схему Prisma
COPY --from=development /app/prisma ./prisma

ARG NODE_ENV=production
ARG PORT
ARG DATABASE_URL
ARG SHADOW_DATABASE_URL

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV SHADOW_DATABASE_URL=${SHADOW_DATABASE_URL}

# Генерируем Prisma Client для продакшена
RUN npx prisma generate

CMD ["pm2-runtime", "dist/main.js"]

EXPOSE $PORT