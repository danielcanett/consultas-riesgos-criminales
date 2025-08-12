FROM node:20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]