### An image for building dependancies of the application itself. In production we don't
### need the entire build toolchain, so we'll build the library here and copy it into the
### production container
FROM node:12.13-alpine AS development

ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++

RUN npm install --only=development

COPY . .

RUN npm install glob rimraf

RUN npm run build

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Copies the build from development
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]