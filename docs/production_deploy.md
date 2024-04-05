# Paso a paso para hacer deploy a producción

Tener instalado en el servidor de producción:

- [ ] Docker
- [ ] Docker Compose

## Antes de comenzar

Debe tener a la mano el archivo .env.production. Puedes pedirle a un compañero que te pase el archivo con las variables de entorno.

## Seguridad

Genera una llave ssh en el servidor de producción y copia la llave pública a tu computadora. Puedes hacer esto ejecutando el siguiente comando:

```bash
make generate_ssh_key VM_IP=<ip del servidor>
```

Este comando generará una llave ssh en el servidor y copiará la llave pública a tu computadora y así evitar que te pida la contraseña cada vez que hagas un push al servidor.

Llena el archivo `.env.production` con las variables de entorno necesarias para el proyecto. Puedes pedirle a un compañero que te pase el archivo con las variables de entorno.

## Deploy

Ejecuta el comando:

```bash
make deploy_production VM_IP=<ip del servidor>
```

Este comando ejecutará los siguientes pasos:

1. Intentará crear una ruta en el servidor de producción para almacenar los archivos necesarios para el deploy.
2. Copia el .env.production al servidor de producción, además del archivo docker-compose.production.yml.
3. Ejecuta comandos de docker para parar el servidor de backend, eliminar el contenedor y la imagen, y volver a crear la imagen y el contenedor.
   1. El contenedor de la base de datos no se elimina, por lo que los datos de la base de datos no se pierden.
   2. El contenedor de la base de datos continua corriendo.
