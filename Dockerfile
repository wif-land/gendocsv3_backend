FROM node:20.16-alpine3.19 AS build

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=America/Bogota
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

FROM node:20.16-alpine3.19 AS production

ENV NODE_ENV=production \
    PORT=3001 \
    TZ=America/Bogota

WORKDIR /app

COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.env ./.env
COPY --from=build --chown=node:node /app/gcp/credentials.json ./gcp/credentials.json
COPY --from=build /app/storage /app/storage

COPY ./scripts/start.sh /app/start.sh

RUN chown node:node /app/start.sh && chmod +x /app/start.sh

USER node

EXPOSE 3001

CMD ["/app/start.sh"]