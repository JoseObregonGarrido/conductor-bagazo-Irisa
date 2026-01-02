# Etapa 1: Build
FROM node:18-alpine as builder

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

EXPOSE 3000

CMD ["sirv", "dist", "--port", "3000", "--gzip", "--brotli"]
