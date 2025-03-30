FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=myapp-frontend /app/dist /usr/share/nginx/html