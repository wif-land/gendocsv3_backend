# Makefile para construir todos los contenedores definidos en docker-compose.yml
.PHONY: up down clean

IMAGE_NAME=leninner/gendocsv3
IMAGE_TAG=latest
VM_IP=$(shell cat .env | grep VIRTUAL_MACHINE_IP | cut -d '=' -f2)

# Levanta todos los contenedores definidos en docker-compose.yml
up:
	docker compose --env-file ./.env up -d

deploy-production:
	ssh root@$(VM_IP) "docker pull $(IMAGE_NAME):$(IMAGE_TAG)"
	scp ./docker-compose.yml root@$(VM_IP):/root/docker-compose.yml
	ssh root@$(VM_IP) "docker compose up -d"

# Detiene y elimina todos los contenedores definidos en docker-compose.yml
down:
	docker compose down

# Delete manually all containers
down-all-containers:
	docker rm -f $(docker ps -a -q)

# Delete manually all images
down-all-images:
	docker rmi -f $(docker images -a -q)

# Delete manually all volumes
down-all-volumes:
	docker volume rm $(docker volume ls -q)

# Delete manually all networks
down-all-networks:
	docker network rm $(docker network ls -q)

# Limpia contenedores, imágenes y volúmenes no utilizados
clean:
	docker system prune -af
	