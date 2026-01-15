# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo el package.json
COPY package.json ./

# Instalamos todas las dependencias (incluyendo las de desarrollo para el build)
RUN npm install

COPY . .

# Generamos la carpeta dist
RUN npm run build

# Etapa 2: Serve con sirv-cli
FROM node:18-alpine

WORKDIR /app

# Instalar sirv-cli para servir archivos estáticos
RUN npm install -g sirv-cli

# Copiar carpeta dist desde la etapa builder
COPY --from=builder /app/dist ./dist

# Puerto para Render
EXPOSE 3000

# Comando para servir la app (modo SPA para React Router)
CMD ["sirv", "dist", "--port", "3000", "--host", "0.0.0.0", "--gzip", "--brotli", "--single"]