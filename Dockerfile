FROM node:21

WORKDIR /usr/src/index

#install dependencies
COPY package*.json ./
RUN npm install

#copy application bundle
COPY . .

CMD [ "npm", "start" ]