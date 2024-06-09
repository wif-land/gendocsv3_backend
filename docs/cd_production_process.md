# Proceso de Despliegue Continuo con Github Actions (Producción)

Este proceso de despliegue continuo te ayudará a hacer deploy a producción del backend de tu proyecto. Asegúrate de seguir los pasos al pie de la letra para evitar problemas.

## Antes de Empezar

Dentro del proyecto **GenDocs V3 Backend** tenemos un proceso de CI/CD que se encarga de hacer deploy a producción cada vez que se hace un push a la rama `main`. 

Este proceso se encuentra en el archivo `.github/workflows/cd-production.yaml`.

- **Configurar las variables de entorno necesarias para el proceso de despliegue**: Dentro de Github, en la sección de `Settings` del repositorio, se deben configurar las siguientes variables de entorno:

```yaml
NODE_ENV=production
APP_PORT=3001
DATABASE_PORT=5432
DATABASE_USERNAME=gendocsuser
DATABASE_PASSWORD=1fsd815
DATABASE_NAME=gendocsv3
BACKEND_DOCKER_IMAGE=leninner/gendocsv3:latest
FRONTEND_DOCKER_IMAGE=leninner/gendocsv3-frontend:latest
```

## Proceso de Despliegue

El archivo `cd-production.yaml` contiene el proceso de despliegue continuo a producción. Tiene la siguiente estructura:

- Declarar el nombre del flujo de trabajo (`Continuous deployment for Gendocs backend`). Y declarar que se ejecutará cada vez que se realice un nuevo tag (`on: push: tags: 'v*.*.*'`).

```yaml
name: Continuous deployment for Gendocs backend

on:
  push:
    tags:
      - 'v*.*.*'
```

- Declara el job `deploy-production` que se encargará de hacer el deploy a producción. Este job se ejecutará en una máquina virtual de ubuntu (`runs-on: ubuntu-latest`).

Los pasos que se deben seguir para hacer el deploy a producción son los siguientes:
1. Hacer checkout del código fuente (`uses: actions/checkout@v3`).
2. Configurar QEMU (`uses: docker/setup-qemu-action@v3`).
3. Configurar Docker Buildx (`uses: docker/setup-buildx-action@v3`).
4. Hacer login en Docker Hub (`uses: docker/login-action@v3`).
5. Construir los artefactos necesarios para el deploy (`run: |`).
6. Construir y subir la imagen con el tag correspondiente a Docker Hub (`uses: docker/build-push-action@v5`).
7. Construir y subir la imagen con el tag `latest` a Docker Hub (`uses: docker/build-push-action@v5`).
8. Finalizar el proceso de despliegue.

```yaml
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build artifacts
        env:
          GCP_CREDENTIALS: ${{ secrets.GCP_CREDENTIALS }}
          ENV_FILE_CREDENTIALS: ${{ secrets.ENV_FILE_CREDENTIALS }}
        run: |
          echo "$GCP_CREDENTIALS" > ./gcp/credentials.json
          echo "$ENV_FILE_CREDENTIALS" > ./.env

      - name: Build and push tag to docker hub
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.production
          push: true
          tags: leninner/gendocsv3:${{ github.ref_name }}

      - name: Build and push latest tag to docker hub
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile.production
          push: true
          tags: leninner/gendocsv3:latest
```