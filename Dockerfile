FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["node", "newServer/index.js"]
