.PHONY: build start stop restart

build:
	npm i --prefix ./api
	docker-compose up --build -V    

start:
	docker-compose up -d

stop:
	docker-compose down

restart: stop start

seed:
	docker compose exec api npm run seed
