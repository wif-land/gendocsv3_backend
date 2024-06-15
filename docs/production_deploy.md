# Paso a paso para hacer deploy a producción

Este paso a paso te ayudará a hacer deploy a producción del backend de tu proyecto. Asegúrate de seguir los pasos al pie de la letra para evitar problemas.

Ten en cuenta que este paso a paso está diseñado para hacerse manualmente, por lo que es importante que sigas cada paso con cuidado. Esto ya que el servidor de producción es un ambiente con Red Local y no se puede acceder a él de manera remota.

## Consideraciones

- El archivo `cd.yaml` contiene los comandos necesarios para hacer el build de la imagen de docker y subirla al registry de docker.
- Este pipeline se ejecuta automáticamente cuando se crea una nueva `release` en el repositorio de github con una **tag** en formato `vX.Y.Z`.

**Nota:** Recomendamos fervientemente que se maneje un versionado semántico para las releases.

## Requisitos antes de comenzar

- Tener instalado `docker` y `docker-compose` en tu computadora.
- Tener acceso al servidor de producción.
- Es mejor utilizar una máquina linux para hacer el deploy.

## Seguridad

Genera una llave ssh en el servidor de producción y copia la llave pública a tu computadora. Puedes hacer esto ejecutando el siguiente comando:

```bash
make generate_ssh_key VM_IP=<ip del servidor>
```

Este comando generará una llave ssh en el servidor y copiará la llave pública a tu computadora y así evitar que te pida la contraseña cada vez que hagas un push/login al servidor.

Llena el archivo `.env.production` con las variables de entorno necesarias para el proyecto. Puedes pedirle a un compañero que te pase el archivo con las variables de entorno.

## Deploy

Ejecuta el comando:

```bash
make deploy_all_production VM_IP=<ip del servidor>
```

Este comando ejecutará los siguientes pasos:

1. Intentará crear una ruta en el servidor de producción para almacenar los archivos necesarios para el deploy.
2. Copia el .env.production al servidor de producción, además del archivo docker-compose.production.yml.
3. Ejecuta comandos de docker para parar el servidor de backend, eliminar el contenedor y la imagen, y volver a crear la imagen y el contenedor.
   1. El contenedor de la base de datos no se elimina, por lo que los datos de la base de datos no se pierden.
   2. El contenedor de la base de datos continua corriendo.

## Backups

Se desarrolló un script que permite hacer backups de la base de datos de producción. Adicionalmente, se creó un makefile que permite ejecutar el script de backups.

Para instalar el cronjob que ejecuta el script de backups, ejecuta el siguiente comando:

```bash
make install_cron
```