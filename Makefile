# Makefile para construir todos los contenedores definidos en docker-compose.yml

.PHONY: up down clean

# Levanta todos los contenedores definidos en docker-compose.yml
up:
	docker compose --env-file ./.env up -d

# Detiene y elimina todos los contenedores definidos en docker-compose.yml
down:
	docker compose down

# Limpia contenedores, imágenes y volúmenes no utilizados
clean:
	docker system prune -af
	