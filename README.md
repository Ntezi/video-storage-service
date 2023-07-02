# Video Storage Service

## Introduction
This project is a video storage Service with REST APIs, which has CRUD implementation as described in the Open API definition. The endpoints of the server are exposed to the host machine.
There three main components in this project:
- **Server** - The server is implemented using Node.js and Express.js. The server is responsible for handling the requests and responses from the client. The server is also responsible for handling the database connection and operations.
- **Database** - The database is implemented using PostgreSQL. The database is responsible for storing the video files and their metadata.
- **Redis** - Redis is used as a cache for the database. The cache is used to store the video files and their metadata. The cache is used to reduce the number of database queries.

## Structure

The project is structured as follows:

```
.
├── README.md
├── docker-compose.yml
├── docker-compose.ci.yml
├── Dockerfile
├── package.json
├── yarn.lock
├── tsconfig.json
├── scripts
│   ├── init_db.sh                          # Initialize the database with the schema and roles for the application
│   └── start.sh                            # Start the application and run the migrations if needed
├── src                                     # Core source code of the application (TypeScript)
│   ├── configs                             # Configuration files for the application and database connection
│   │   ├── CrudInterface.ts                # Interface for CRUD operations
│   │   ├── RouteConfig.tsn                 # Route configuration
│   │   ├── ServerConfig.ts                 # Server configuration
│   │   └── db                              # Database configuration files (TypeORM)
│   │       ├── migrations                  # Database migrations
│   │       │   └── 1645134357970-init.ts   # Initial migration to create tables
│   │       ├── sql
│   │       │   └── init_video_storage.sql  # SQL script to create tables
│   │       └── VideoStorageDataSource.ts   # Database connection
│   ├── controllers                         # Controllers for the API endpoints (TypeScript)
│   │   └── v1                              # Controllers for the v1 API version (TypeScript)
│   │       └── VideoController.ts          # Controller for video file operations (CRUD)
│   ├── daos                                # Data access objects for database operations (CRUD)
│   │   └── v1                              # Data access objects for the v1 API version (TypeScript)
│   │       └── VideoFileDao.ts             # Data access object for video file operations (CRUD) (TypeScript)
│   ├── dtos                                # Data transfer objects for the API endpoints (TypeScript)
│   │   └── v1                              # Data transfer objects for the v1 API version (TypeScript)
│   │       └── VideoFileDto.ts             # Data transfer object for video file operations (CRUD) (TypeScript)
│   ├── entities                            # Database entities (TypeScript)
│   │   └── v1                              # Database entities for the v1 API version (TypeScript)
│   │       └── VideoFile.ts                # Database entity for video file operations (CRUD) (TypeScript)
│   ├── middlewares                         # Middlewares for the API endpoints (TypeScript)
│   │   ├── v1                              # Middlewares for the v1 API version (TypeScript)
│   │   │   └── VideoFileMiddleware.ts      # Middleware for video file operations (CRUD) (TypeScript)
│   │   ├── CLSMiddleware.ts                # Middleware for CLS-hooked and bind the request ID to the logger (TypeScript)
│   │   └── LoggerMiddleware.ts             # Middleware for logging the API endpoints (TypeScript)
│   ├── routes                              # Routes for the API endpoints (TypeScript)
│   │   └── v1                              # Routes for the v1 API version (TypeScript)
│   │       └── VideoFileRoute.ts           # Routes for video file operations (CRUD) (TypeScript)
│   ├── services                            # Services for the API endpoints (TypeScript)
│   │   └── v1                              # Services for the v1 API version (TypeScript)
│   │       └── VideoFileService.ts         # Service for video file operations (CRUD) (TypeScript)
│   ├── swagger                             # OpenAPI specification for the API endpoints (TypeScript)
│   │   └── v1                              # OpenAPI specification for the v1 API version (TypeScript)
│   │       └── api.yaml                    # OpenAPI specification for the API endpoints (TypeScript)
│   ├── utils                               # Utility functions (TypeScript)
│   │   ├── Constants.ts                    # Constants for the application (TypeScript)
│   │   ├── CustomResponse.ts               # Custom response for the application (TypeScript)
│   │   ├── HelperFunctions.ts              # Helper functions for the application (TypeScript)
│   │   ├── Logger.ts                       # Logger for the application (TypeScript)
│   │   ├── Redisclient.ts                  # Redis client for the application (TypeScript)
│   │   └── VideoFileHandler.ts             # Handler for video file operations such as upload, download, delete (TypeScript)                                              
├── test                                    # Test files for the application (TypeScript)
│   └── tester.json                         # Postman collection for testing the API endpoints
├── .dockerignore                           # Docker ignore file for the application
├── .gitignore                              # Git ignore file for the application
├── .yarnclean                              # Yarn clean file for the application
├── docker-compose.yml                      # Docker compose file for the application
├── Dockerfile                              # Docker file for the application
├── package.json                            # Package file for the application
├── tsconfig.json                           # TypeScript configuration file for the application
├── yarn.lock                               # Yarn lock file for the application
└── .env                                    # Environment variables for the application

```

## Requirements:
- [Docker](https://docs.docker.com/get-docker/)

## Tech Stack
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/#/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [OpenAPI](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Multer](https://www.npmjs.com/package/multer)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Winston](https://www.npmjs.com/package/winston)
- [CLS-hooked](https://www.npmjs.com/package/cls-hooked)

## Run / Install

To start the project with Docker Compose, run:

```shell
docker-compose up --build
```

## Swagger UI

To view the Swagger UI:

- Run the project with Docker Compose
- Go to http://localhost:8080

## Developer
Marius Ngaboyamahina, Senior Software Engineer
LinkedIn: [Marius Ngaboyamahina](https://www.linkedin.com/in/ntezi/)

