
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

### certs
```bash

```

### containers

#### up
```bash
#PROD
docker-compose up -d --build
#LOCAL
docker-compose --profile development up -d --build

docker ps
docker-compose exec backend php artisan migrate
docker compose exec backend chmod -R 777 storage bootstrap/cache
```

optional if have seeders
```bash
docker-compose exec backend php artisan db:seed 
```
#### down & clean

```bash
docker-compose down 
```

delete volumes (like DB):
```bash
docker-compose down --volumes
```

#### check logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```