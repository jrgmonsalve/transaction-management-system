
# Transaction Management System - Quick Start

## Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose


## Setup Instructions in local

### Modify .env files

1. Run the following commands to create the .env files we are going to use.

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Then modify each .env

 - In **.env** for the **docker composer** you must modify all the variables.
 - In the **backend/.env** for the **API** you only have to modify these variables, keep in mind that the values ​​must match the .env of the docker composer
```bash
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=secret
API_KEY=your_secure_api_key
```
 - In the **frontend/.env** for the **frontend** you must modify all the variables the API_KEY from matching the one in the backend

----

### Up containers

NOTA: remember change Dockerfile.dev to Dockerfile.prod in docker-composer.yml
```bash
docker compose up -d --build

docker ps
docker compose exec backend composer install
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate
docker compose exec backend chmod -R 775 storage bootstrap/cache
docker compose exec backend chown -R www-data:www-data storage bootstrap/cache

```

### Down & Clean

```bash
docker compose down 
# or if you want delete volumes:
docker compose down --volumes
```

### Check logs or debug problems
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
# get in container
docker exec -it <container-id> bash
```
---

## Tests
To add in pipeline of CI/CD
```bash
docker compose exec backend php artisan test --filter TransactionControllerTest
docker compose exec backend npm test
```