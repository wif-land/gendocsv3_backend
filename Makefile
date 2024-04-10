.PHONY: up down clean deploy_production backup generate_ssh_key

ENV_FILE := .env
ENV_FILE_PRODUCTION := .env.production
COMPOSE_DEVELOP_FILE := docker-compose.develop.yaml
COMPOSE_PRODUCTION_FILE := docker-compose.production.yaml
REMOTE_DIR := /root/gendocsv3
VM_USER := root
BACKEND_DOCKER_IMAGE := leninner/gendocsv3:latest
FRONTEND_DOCKER_IMAGE := leninner/gendocsv3-frontend:latest

up:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) up -d
	@make run_migrations

run_migrations:
	npm install
	npm run migration:run

down:
	docker compose -f $(COMPOSE_DEVELOP_FILE) --env-file $(ENV_FILE) down

clean:
	docker system prune -af

deploy_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying to production..."
	@make create_remote_directory
	@make copy_files

create_remote_directory:
	@echo "Creating remote directory for gendocs..."
	@ssh $(VM_USER)@$(VM_IP) "mkdir -p $(REMOTE_DIR)"

copy_files:
	@echo "Copying files..."
	@scp $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/

deploy_backend_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying backend to production..."
	@ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down backend && \
														docker rmi ${BACKEND_DOCKER_IMAGE} && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d backend"

deploy_frontend_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying frontend to production..."
	@ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down frontend && \
														docker rmi ${FRONTEND_DOCKER_IMAGE} && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d frontend"

deploy_db_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying db to production..."
	@ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down postgres && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d postgres"

deploy_all_production:
	@make deploy_production
	@make run_migrations
	@make deploy_backend_production
	@make deploy_frontend_production
	@echo "Deployed successfully!"

backup:
	ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && docker exec -it gendocsv3_postgres pg_dump -U postgres -d gendocsv3 > $(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql"
	scp $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/backup_`date +'%Y%m%d%H%M%S'`.sql ./backup_`date +'%Y%m%d%H%M%S'`.sql

generate_ssh_key:
	ssh-keygen -t rsa -b 2048 -C "gendocsv3" -f ~/.ssh/id_gendocsv3 -N "" | true
	scp ~/.ssh/id_gendocsv3.pub ${VM_USER}@$(VM_IP):~/.ssh/authorized_keys
