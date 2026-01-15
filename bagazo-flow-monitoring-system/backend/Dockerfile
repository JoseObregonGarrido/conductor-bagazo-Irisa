# Etapa 1: Base con Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# 1. Copiar SOLO el package.json (ya que no hay package-lock.json)
COPY package.json ./

# 2. Cambiamos 'npm ci' por 'npm install' para que no chille por el archivo lock
# Usamos --omit=dev para que la imagen sea liviana y solo para producción
RUN npm install --omit=dev

# 3. Copiar el resto de la aplicacion
COPY . .

# Exponer puerto (Render usará el que definas en el panel, pero 5000 es el estándar de tu app)
EXPOSE 5000

# Variable de entorno
ENV NODE_ENV=production

# Comando para iniciar
CMD ["npm", "start"]