FROM node:14.16-alpine

WORKDIR /home/node/

COPY . .

CMD ["yarn", "start:prod"]

EXPOSE 80
