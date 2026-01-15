# Etapa 1: Base con Node.js
FROM node:18-alpine

WORKDIR /app

# 1. Copiamos solo el package.json
COPY package.json ./    

# 2. Usamos 'npm install' en lugar de 'npm ci' (ya que no hay lock file)
RUN npm install --only=production

COPY . .

# El puerto debe coincidir con lo que configuramos en Render (10000)
EXPOSE 10000

ENV NODE_ENV=production

CMD ["npm", "start"]