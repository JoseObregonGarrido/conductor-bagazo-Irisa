# Etapa 1: Base con Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto de la aplicación
COPY . .

# Exponer puerto
EXPOSE 5000

# Variable de entorno
ENV NODE_ENV=production

# Comando para iniciar
CMD ["npm", "start"]
