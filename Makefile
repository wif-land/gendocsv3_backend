# Makefile para construir todos los contenedores definidos en docker-compose.yml
.PHONY: up down clean deploy_production

IMAGE_NAME=leninner/gendocsv3
IMAGE_TAG=latest

# Levanta todos los contenedores definidos en docker-compose.yml
up:
	docker compose --env-file ./.env up -d

deploy_production: .env docker-compose.yaml Makefile
		ssh root@$(VM_IP) "cd /root/gendocsv3 && make down && make clean"
		scp -r ./.env root@$(VM_IP):/root/gendocsv3/
		scp -r ./docker-compose.production.yaml root@$(VM_IP):/root/gendocsv3/
		scp -r ./Makefile root@$(VM_IP):/root/gendocsv3/Makefile
		ssh root@$(VM_IP) "docker compose -f /root/gendocsv3/docker-compose.production.yaml --env-file /root/gendocsv3/.env up -d"

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
	