# Build stage
FROM node:lts-alpine AS build

RUN apk update && \
    apk upgrade && \
    apk add postgresql-client

WORKDIR /srv/app

COPY package.json tsconfig.json .env scripts/startup.sh ./

RUN chmod +x startup.sh

RUN npm install

COPY src ./src/

# Production stage
FROM node:lts-alpine AS production

WORKDIR /srv/app

COPY --from=build /srv/app /srv/app

RUN apk update && \
    apk upgrade && \
    apk add postgresql-client && \
    rm -rf /var/cache/apk/*

RUN chmod +x startup.sh

ENTRYPOINT ["./startup.sh"]

