# Étape unique — Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers du portfolio dans le dossier servi par Nginx
COPY index.html  /usr/share/nginx/html/
COPY styles.css  /usr/share/nginx/html/
COPY script.js   /usr/share/nginx/html/

# Configuration Nginx personnalisée (gzip, cache, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
