FROM node:18

COPY dist .
COPY package.json .

RUN npm i

EXPOSE 3030

CMD ["node", "index.js"]