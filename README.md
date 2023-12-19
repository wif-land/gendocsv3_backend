# GenDocs

Version: 3.0.0

## Descripción

Este proyecto es creado para la Universidad Técnica de Ambato que se planea sea usada por las secretarias de la universidad para aspectos legales y de comunicación.

## Instalación

Usa la versión 18.18.2 de `NodeJS` o superior.

1. Ejecuta el comando de `docker` para crear la imagen de la base de datos

```bash
docker compose up -d
```

2. Llena el archivo `.env` con las variables de entorno necesarias

```bash
# DEVELOPMENT
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
DATABASE_SYNCHRONIZE=true
```

3. Instala las dependencias
  
```bash
npm install
```

4. Inicia el servidor de desarrollo

```bash
npm run start
```

O  si deseas que se reinicie el servidor cada vez que se haga un cambio en el código

```bash
npm run start:dev
```

O si deseas que se reinicie el servidor cada vez que se haga un cambio en el código y que se muestren los logs de la aplicación

```bash
npm run start:debug
```

5. Abre el navegador en la dirección `http://localhost:3001`


