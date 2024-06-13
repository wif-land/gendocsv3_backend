# GenDocs

Version: 3.0.0

## Descripción

Este proyecto es creado para la Universidad Técnica de Ambato que se planea sea usada por las secretarias de la universidad para aspectos legales y de comunicación.

## Requisitos

- NVM (Node version manager)
- Docker
- Make

## Modo de uso

1. Usa la versión de node correcta

```bash
nvm use
```

2. Ejecuta el comando de `make` para crear la imagen de la base de datos y ejecutar las migraciones

```bash
make up
```

***Nota**: Si no se reconoce el comando make puedes instalar el paquete:

#### En linux:

```bash
# Debian/Ubuntu
sudo apt-get install make

# Fedora
sudo dnf install make

# Arch
sudo pacman -S make

# AlmaLinux/CentOS
sudo yum install make
```

#### En windows:

Puedes usar cualquier manejador de paquetes, la presente guía muestra el paso a paso usando `chocolately` el cual puede instalar siguiendo el siguiente enlace: https://chocolatey.org/

Una vez instalado, se ejecuta el siguiente comando en una consola (con permisos de administrador):

```bash
choco install make
```

3. Llena el archivo `.env` con las variables de entorno necesarias

Pregunta a un miembro del equipo de desarrollo para que te proporcione las variables de entorno necesarias para el proyecto. O míralas dentro del notion del proyecto.

4. En la carpeta `gcp` del root del proyecto crea un archivo llamado `credentials.json` y pide a un miembro del equipo de desarrollo que te proporcione el archivo.
 
5. Instala las dependencias

```bash
npm install
```

6. Inicia el servidor de desarrollo

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

7. Abre el navegador en la dirección `http://localhost:3001/api`

### Migraciones

Para crear una nueva migración ejecuta el siguiente comando:

```bash
npm run migration:create --name=<nombre de la migración en snake-case>
```

Para ejecutar las migraciones ejecuta el siguiente comando:

```bash
npm run migration:run
```

Para revertir las migraciones ejecuta el siguiente comando:

```bash
npm run migration:revert
```
