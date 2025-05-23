FROM node:18-alpine

WORKDIR /app

RUN npm install -g concurrently

COPY package.json ./
COPY frontend/package.json ./frontend/

RUN npm install

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app
COPY . .

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "run", "start-all"]
