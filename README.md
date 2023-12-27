# GenDocs

Version: 3.0.0

## Descripción

Este proyecto es creado para la Universidad Técnica de Ambato que se planea sea usada por las secretarias de la universidad para aspectos legales y de comunicación.

## Instalación

Usa la versión 18.18.2 de `NodeJS` o superior.

1. Ejecuta el comando de `make` para crear la imagen de la base de datos

```bash
make up
```
   ***Nota**:
  Si no se reconoce el comando make puedes instalar el paquete:
  
  #### En linux:
  ```bash
  sudo apt-get install make
  ```

  #### En windows:
  Primero se necesita tener instalado chocolatey, se puede instalar siguiendo el siguiente enlace: https://chocolatey.org/
  
  Una vez instalado, se ejecuta el siguiente comando en una consola (con permisos de administrador):
  ```bash
  choco install make
  ```

2. Llena el archivo `.env` con las variables de entorno necesarias

```bash
# DEVELOPMENT
NODE_ENV=development
PORT=3001
DATABASE_USERNAME=gendocsuser
DATABASE_PASSWORD=1fsd815
DATABASE_NAME=gendocsv3
DATABASE_SYNCHRONIZE=true
JWT_SECRET=SUPERS$CR3T!
JWT_EXPIRES_IN=7 days
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


