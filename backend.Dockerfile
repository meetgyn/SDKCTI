
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install ts-node typescript @types/node @types/express @types/cors -D
CMD ["npx", "ts-node", "backend/server.ts"]
