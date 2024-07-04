# GenDocs

Version: 3.0.0

## Descripción

Proyecto de generación de documentos y manejo de plantillas para la Universidad Técnica de Ambato.

## Requisitos

Es recomendable tener instalado `nvm` para poder cambiar de versión de node de manera sencilla.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

```bash
nvm install 20.14.0
```

Es recomendable tener un sistema operativo basado en linux para poder ejecutar los comandos de `make` de manera sencilla.

### Dependencias

| Dependencia | Versión |
| ----------- | ------- |
| Node        | 20.14.0 |
| NPM         | 10.7.0  |
| Docker      | 27.0.3  |

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

| Comando               | Descripción |
| --------------------- | ----------- |
| `npm install`         | Instala las dependencias del proyecto |
| `npm run start`       | Inicia el servidor de desarrollo |
| `npm run start:dev`   | Inicia el servidor de desarrollo y se reinicia cada vez que se haga un cambio en el código |
| `npm run start:debug` | Inicia el servidor de desarrollo y se reinicia cada vez que se haga un cambio en el código y muestra los logs de la aplicación |

Abre el navegador en la dirección `http://localhost:3001/api`

### Migraciones

| Comando                    | Descripción |
| -------------------------- | ----------- |
| `npm run migration:create --name=<nombre de la migración en snake-case>` | Crea una nueva migración |
| `npm run migration:run`    | Ejecuta las migraciones |
| `npm run migration:revert` | Revierte las migraciones |
