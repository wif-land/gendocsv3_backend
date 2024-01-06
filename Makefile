.PHONY: up down clean deploy_production backup

ENV_FILE := .env
COMPOSE_DEVELOP_FILE := docker-compose.develop.yaml
COMPOSE_PRODUCTION_FILE := docker-compose.production.yaml
REMOTE_DIR := /root/gendocsv3

up:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) up -d

down:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) down

clean:
	docker system prune -af

deploy_production: $(ENV_FILE) $(COMPOSE_PRODUCTION_FILE) Makefile
	ssh root@$(VM_IP) "mkdir -p $(REMOTE_DIR) || true"
	scp -r $(ENV_FILE) root@$(VM_IP):$(REMOTE_DIR)/
	scp -r $(COMPOSE_PRODUCTION_FILE) root@$(VM_IP):$(REMOTE_DIR)/
	ssh root@$(VM_IP) "cd $(REMOTE_DIR) && make backup && docker compose -f $(REMOTE_DIR)/$(COMPOSE_PRODUCTION_FILE) --env-file $(REMOTE_DIR)/$(ENV_FILE) down && docker system prune -af"
	ssh root@$(VM_IP) "docker compose -f $(REMOTE_DIR)/$(COMPOSE_PRODUCTION_FILE) --env-file $(REMOTE_DIR)/$(ENV_FILE) up -d"

backup:
	ssh root@$(VM_IP) "cd $(REMOTE_DIR) && docker exec -it gendocsv3_postgres pg_dump -U postgres -d gendocsv3 > $(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql"
	scp root@$(VM_IP):$(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql ./backup_`date +'%Y%m%d%H%M%S'`.sql
