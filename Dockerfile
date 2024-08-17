FROM node:20.16-alpine3.19 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20.16-alpine3.19 AS production

ENV NODE_ENV=production \
    PORT=3001 \
    TZ=America/Bogota

RUN apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/America/Bogota /etc/localtime \
    && echo "America/Bogota" > /etc/timezone

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.env ./.env
COPY --from=build /app/gcp/credentials.json ./gcp/credentials.json
COPY --from=build /app/storage /app/storage

COPY ./scripts/start.sh /app/start.sh

RUN chmod +x /app/start.sh

USER node

EXPOSE 3001

CMD ["/app/start.sh"]
