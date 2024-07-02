.PHONY: up down clean prepare_production backup generate_ssh_key deploy_all_production deploy_backend_production deploy_frontend_production deploy_db_production install_cron uninstall_cron

ENV_FILE := .env
ENV_FILE_PRODUCTION := .env.production
COMPOSE_DEVELOP_FILE := docker-compose.develop.yaml
COMPOSE_PRODUCTION_FILE := docker-compose.production.yaml
REMOTE_DIR := /root/gendocsv3
VM_USER := root
BACKEND_DOCKER_IMAGE := leninner/gendocsv3:latest
FRONTEND_DOCKER_IMAGE := leninner/gendocsv3-frontend:latest
LOCAL_BACKUP_SCRIPT := ./scripts/backup.sh
REMOTE_BACKUP_SCRIPT := $REMOTE_DIR/backup.sh
REMOTE_BACKUPS_DIR := /var/gendocsv3/backups
CRON_SCHEDULE := "* 19 * * *" # Every day at 19:00 hours

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

prepare_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying to production..."
	@make create_remote_directory
	@make copy_files
	@make install_backup_script_cron
	@echo "Prepared successfully!"

create_remote_directory:
	@echo "Creating remote directory for gendocs related files..."
	@ssh $(VM_USER)@$(VM_IP) "mkdir -p $(REMOTE_DIR)"
	@echo "Creating remote directory for backups..."
	@ssh $(VM_USER)@$(VM_IP) "mkdir -p $(REMOTE_BACKUPS_DIR)"

copy_files:
	@echo "Copying files..."
	@scp $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/

deploy_backend_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying backend to production..."
	@make backup
	@ssh $(VM_USER)@$(VM_IP) 'cd $(REMOTE_DIR) && \
														if [ $$(docker ps -q -f name=gendocsv3_backend) ] || [ $$(docker ps -q -f name=gendocsv3_bull_redis) ]; then \
															docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down backend bull_redis; \
														fi && \
														docker rmi ${BACKEND_DOCKER_IMAGE} || true && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d backend bull_redis'

deploy_frontend_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying frontend to production..."
	@ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down frontend && \
														docker rmi ${FRONTEND_DOCKER_IMAGE} | true && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d frontend"

deploy_db_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@echo "Deploying db to production..."
	@ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) down postgres && \
														docker compose -f $(COMPOSE_PRODUCTION_FILE) --env-file $(ENV_FILE_PRODUCTION) up -d postgres"

deploy_all_production: $(ENV_FILE_PRODUCTION) $(COMPOSE_PRODUCTION_FILE) Makefile
	@make prepare_production
	@make deploy_db_production
	@make deploy_backend_production
	@make deploy_frontend_production
	@echo "Deployed successfully!"

backup:
	@echo "Realizando backup previo a la actualización..."
	@ssh $(VM_USER)@$(VM_IP) "$(REMOTE_BACKUP_SCRIPT)"

generate_ssh_key:
	ssh-keygen -t rsa -b 2048 -C "gendocsv3" -f ~/.ssh/id_gendocsv3 -N "" | true
	scp ~/.ssh/id_gendocsv3.pub ${VM_USER}@$(VM_IP):~/.ssh/authorized_keys

install_backup_script_cron:
	@echo "Instalando el script de backup en el cronjob..."
	scp $(LOCAL_BACKUP_SCRIPT) $(VM_USER)@$(VM_IP):$(REMOTE_DIR)/
	ssh $(VM_USER)@$(VM_IP) "cd $(REMOTE_DIR) && echo '$(CRON_SCHEDULE) $(REMOTE_BACKUP_SCRIPT)' > gendocsv3_backup_script && crontab -l | { cat; echo '$(CRON_SCHEDULE) $(REMOTE_DIR)/gendocsv3_backup_script'; } | crontab -"
	@echo "Cronjob instalado correctamente."
