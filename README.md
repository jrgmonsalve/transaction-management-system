
# Transaction Management System - Quick Start

## Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose


## Setup Instructions in local

### modify .env files
```bash
#grl all variables

# back
APP_ENV=production
DB_CONNECTION=mysql
DB_HOST=database
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=secret
API_KEY=your_secure_api_key

#front all variables
```

### generate certs
```bash

```

### containers

#### up
remember change Dockerfile.dev to Dockerfile.prod in docker-composer.yml
```bash
docker compose up -d --build

docker ps
docker compose exec backend php artisan migrate
#docker compose exec backend php artisan migrate:fresh
docker compose exec backend chmod -R 775 storage bootstrap/cache
docker compose exec backend chown -R www-data:www-data storage bootstrap/cache

docker compose exec backend php artisan app:import-transactions storage/app/private/transactions.csv

```

optional if have seeders
```bash
docker compose exec backend php artisan db:seed 
```
#### down & clean

```bash
docker compose down 
```

delete volumes (like DB):
```bash
docker compose down --volumes
```

#### check logs or debug problems
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

docker exec -it <backend-container-id> bash
```


#### test
to add in pipeline of CI/CD
```bash
docker compose exec backend php artisan test --filter TransactionControllerTest
```