FROM node:18-alpine

WORKDIR /user/src/app

COPY package.json yarn.lock ./

COPY prisma ./prisma/

RUN yarn install --frozen-lockfile --prod

COPY . .

RUN yarn build

USER root

CMD ["yarn", "start:prod"]