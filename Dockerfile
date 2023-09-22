# |=============================================|
# |                                             |
# | Frontend Build Dockerfile                   |
# |                                             |
# |=============================================|

FROM node:16

WORKDIR /app

# Installing the dependencies
RUN npm install -g yarn
COPY package*.json ./
RUN yarn

COPY . .

# Building the documents
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]