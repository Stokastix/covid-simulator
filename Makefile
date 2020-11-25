.PHONY: build start

build: build
	docker-compose up build

start:
	docker-compose up start

