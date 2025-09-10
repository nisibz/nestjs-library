FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@9.6.0

CMD ["pnpm", "run", "start:dev"]
