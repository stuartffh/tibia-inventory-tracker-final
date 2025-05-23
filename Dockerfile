FROM node:18-alpine

WORKDIR /app

RUN npm install -g concurrently

# Copia apenas arquivos raiz para instalar dependências do backend
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia tudo do frontend para sua pasta
COPY frontend ./frontend

WORKDIR /app/frontend
RUN npm install && chmod +x ./node_modules/.bin/next
RUN npm run build

# Volta pro backend e copia apenas o restante, ignorando o frontend para não sobrescrever
WORKDIR /app

# Copia tudo exceto o frontend (mantido do passo anterior)
COPY . ./
# Mas ignora recópia do frontend com .dockerignore (veja abaixo)

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "run", "start-all"]
