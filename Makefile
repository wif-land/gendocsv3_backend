# Makefile para construir todos los contenedores definidos en docker-compose.yml

.PHONY: up down clean

# Levanta todos los contenedores definidos en docker-compose.yml
up:
	docker compose --env-file ./.env up -d

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
	