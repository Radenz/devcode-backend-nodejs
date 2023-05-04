FROM node:18

COPY dist .
COPY package.json .

RUN npm i

EXPOSE 8090

CMD ["node", "index.js"]