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

***Nota**: Si no se reconoce el comando make puedes instalar el paquete:

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

Pregunta a un miembro del equipo de desarrollo para que te proporcione las variables de entorno necesarias para el proyecto. O míralas dentro del notion del proyecto.

3. En la carpeta `gcp` del root del proyecto crea un archivo llamado `credentials.json` y pide a un miembro del equipo de desarrollo que te proporcione el archivo.

3. Usa la versión de node correcta

```bash
nvm use
```
  
4. Instala las dependencias

```bash
npm install
```

5. Inicia el servidor de desarrollo

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

6. Abre el navegador en la dirección `http://localhost:3001/api`


