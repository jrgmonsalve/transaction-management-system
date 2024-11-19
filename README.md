
# Transaction Management System - Quick Start

## Prerequisites
Ensure you have the following installed:
- Docker
- Docker Compose

## Setup Instructions

### 1. Build and Start the Containers
Run the following command to build and start the backend (Laravel) and frontend (React) containers:
```bash
docker-compose up --build
```

### 2. Laravel Setup (One-Time)
1. Access the Laravel container:
   ```bash
   docker exec -it laravel_app bash
   ```
1. Modify .env file:
   ```bash
   vi .env
   ```
1. Generate the application key and run migrations:
   ```bash
   php artisan key:generate
   php artisan migrate
   ```
1. Exit the container:
   ```bash
   exit
   ```

### Stopping the Project
To stop all containers, run:
```bash
docker-compose down
```