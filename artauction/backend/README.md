# check Docker and Compose
docker --version
docker compose version || docker-compose --version

# from project root (where `docker-compose.yml` lives) build and start services
docker compose up --build -d

# follow logs for the backend service
docker compose logs -f backend

# list running services/containers
docker compose ps

# stop and remove containers, networks, and (optionally) volumes
docker compose down --volumes --remove-orphans

# if your system uses old CLI:
docker-compose up --build -d