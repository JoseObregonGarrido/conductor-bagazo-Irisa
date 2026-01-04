# Etapa 1: Build
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Etapa 2: Serve
FROM node:18-alpine

WORKDIR /app

# Instalar sirv-cli para servir archivos estáticos
RUN npm install -g sirv-cli

# Copiar carpeta dist desde builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto 3000 (el mismo que definimos en docker-compose)
EXPOSE 3000

# Comando para servir la app permitiendo conexiones externas y manejo de SPA (Single Page Application)
CMD ["sirv", "dist", "--port", "3000", "--host", "0.0.0.0", "--gzip", "--brotli", "--single"]   