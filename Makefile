.PHONY: up down clean deploy_production

up:
	docker compose -f docker-compose.develop.yaml --env-file .env up -d

down:
	docker compose -f docker-compose.develop.yaml --env-file .env down

clean:
	docker system prune -af

deploy_production: .env docker-compose.yaml Makefile
		ssh root@$(VM_IP) "cd /root/gendocsv3 && make down && make clean"
		scp -r ./.env root@$(VM_IP):/root/gendocsv3/
		scp -r ./docker-compose.production.yaml root@$(VM_IP):/root/gendocsv3/
		scp -r ./Makefile root@$(VM_IP):/root/gendocsv3/Makefile
		ssh root@$(VM_IP) "docker compose -f /root/gendocsv3/docker-compose.production.yaml --env-file /root/gendocsv3/.env up -d"
