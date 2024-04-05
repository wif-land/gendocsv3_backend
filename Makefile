.PHONY: up down clean deploy_production backup generate_ssh_key

ENV_FILE := .env
ENV_FILE_PRODUCTION := .env.production
COMPOSE_DEVELOP_FILE := docker-compose.develop.yaml
COMPOSE_PRODUCTION_FILE := docker-compose.production.yaml
REMOTE_DIR := /root/gendocsv3
VM_USER := root

up:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) up -d
	npm install
	npm run migration:run

down:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) down

clean:
	docker system prune -af

deploy_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	echo "Deploying to production..."
	echo "Creating remote directory..."
	ssh $(VM_USER)@$(VM_IP) "mkdir -p $(REMOTE_DIR)"
	echo "Copying files..."
	scp $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/
	echo "Deploying..."
	ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && docker compose -f $(REMOTE_DIR)/$(COMPOSE_PRODUCTION_FILE) --env-file $(REMOTE_DIR)/$(ENV_FILE_PRODUCTION) down && docker system prune -af && docker compose -f $(REMOTE_DIR)/$(COMPOSE_PRODUCTION_FILE) --env-file $(REMOTE_DIR)/$(ENV_FILE_PRODUCTION) up -d \

backup:
	ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && docker exec -it gendocsv3_postgres pg_dump -U postgres -d gendocsv3 > $(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql"
	scp $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql ./backup_`date +'%Y%m%d%H%M%S'`.sql

generate_ssh_key:
	ssh-keygen -t rsa -b 2048 -C "gendocsv3" -f ~/.ssh/id_gendocsv3 -N "" | true
	scp ~/.ssh/id_gendocsv3.pub ${VM_USER}@$(VM_IP):~/.ssh/authorized_keys
