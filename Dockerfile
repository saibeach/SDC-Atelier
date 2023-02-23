FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV production
ENV PORT 3000
ENV AUTHTOKEN=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


EXPOSE 3000

CMD ["node", "newServer/index.js"]
