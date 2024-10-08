FROM node:20.10-alpine3.18

WORKDIR /app

RUN apk add --no-cache tzdata

ENV TZ=America/Bogota

RUN cp /usr/share/zoneinfo/America/Bogota /etc/localtime

COPY package*.json ./

RUN npm ci --omiy=dev

COPY . .

RUN npm run build

COPY ./scripts/start.sh /app/start.sh

RUN chmod +x /app/start.sh

EXPOSE 3001

CMD ["/app/start.sh"]