FROM node:20-alpine

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
