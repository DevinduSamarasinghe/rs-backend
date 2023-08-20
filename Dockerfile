
#Build stage
FROM node:18.6

WORKDIR /usr/src/dist

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run","start"]
