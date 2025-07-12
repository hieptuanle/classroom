FROM node:24-alpine

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 4000

CMD ["node", "dist/src/index.js"]
