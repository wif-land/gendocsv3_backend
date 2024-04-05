# Paso a paso para hacer deploy a producción

Tener instalado en el servidor de producción:

- [ ] Docker
- [ ] Docker Compose
- [ ] Git

## Antes de comenzar

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
2. 