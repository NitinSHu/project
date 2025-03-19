# Dockerized CRM Application

This project has been dockerized to make development and deployment easier. The application consists of three main components:

1. **Frontend**: React application served by Nginx
2. **Backend**: Flask REST API
3. **Database**: MySQL server

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Running the Application

1. Clone the repository
2. Navigate to the project root directory
3. Build and start the containers:

```bash
docker-compose up -d --build
```

This command will:
- Build all the necessary Docker images
- Create and start the containers
- Set up the database
- Initialize the API
- Serve the frontend

### Accessing the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Database**: Available on port 3307 (can be accessed with MySQL client tools)

### Stopping the Application

```bash
docker-compose down
```

To remove volumes (including the database data):

```bash
docker-compose down -v
```

## Development Workflow

### Rebuilding Containers After Code Changes

```bash
docker-compose up -d --build
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Database Access

The MySQL database is exposed on port 3307. You can connect to it using:

- Host: localhost
- Port: 3307
- Username: root
- Password: root
- Database name: crm_database

## Troubleshooting

### Backend can't connect to the database

The backend service is configured to wait for the database to be ready before starting, but in some cases, you might need to restart it:

```bash
docker-compose restart backend
```

### Frontend can't connect to the backend

Check that the backend service is running and healthy:

```bash
docker-compose ps
```

If needed, restart the frontend service:

```bash
docker-compose restart frontend
``` 