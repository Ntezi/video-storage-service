# Challenge Statement

This challenge is about creating a simple video storage server with REST APIs

## Details

You are tasked to develop a simple video storage server with REST APIs, which should have:
- **CRUD implemention** as described in the [Open API definition](src/swagger/v1/api.yaml). (This document only contains the minimum and may need to be added).
- **Dockerfile** and **docker-compose** to build and run the server and other required services as docker containers.
- The endpoints of the server are exposed to the host machine.

## What we expect

When working on this challenge, be sure to:

- prove correctness of the code. We don't expect 100% test coverage but highlights on critical paths and logic is very welcome.
  
- handle errors and bad inputs
  
- provide user friendliness of installation and setup. We'll run `docker-compose up` in a clean environment without toolchains, JVM or SDKs and expect to see a server and the needed containers building and starting (this includes DB and all the other images used to complete the task).

We understand taking a challenge is time consuming, so feel free to choose an additional feature you feel passionate about and explain in words how you would like to implement it. We can discuss it further during the next interview steps!

## How to submit your solution

- Push your code to this repository in the `main` branch.
- Make sure the endpoints follow the path suggested in the `api.yaml` file (v1 included!).
- If your setup is correct the CI will return a green check and you can move forward. 

⚠️ **Note #1**: the CI/CD runs checks against a set of tests necessary to consider the assigment correct. _Without a green check we won't review the challenge_ as we can safely assume the overall solution is incomplete. Also, please *DO NOT* change the CI/CD workflow file _or_ the `test/tester.json` file - if you want to add your own tests, please add them in a dedicated folder of your choice.

⚠️ **Note #2**: if you add or change APIs, include its OpenAPI document. However, please note that your server may be accessed by external clients in accordance with the given OpenAPI document and automated tests will hit the endpoints as described in [api.yaml](src/swagger/v1/api.yaml), therefore any change in the base path could result in 404 or false negative.

## FAQ
_Questions outside of this FAQ will not be answered. Please include them with your challenge submission and they can be covered in the technical interview stage._


**My submission is not passing the health check. Can I still submit it for review?**

Your submission must pass all automated tests to be considered for review. If it doesn’t pass, your solution won’t be considered correct. The workflow should also pass without modification. 

**Do you have any limit to the file size?**

No. As long as the CI pipeline doesn’t complain we don’t have requirements.

**Do I need to demonstrate other aspects in backend developments, like code quality, to pass because 100% test coverage is the basic requirement?**

Code quality, folder structure and software development principles are considered during the solution review. Naming variables “xyz” is usually a minus even if the solution is correct.

**Where should I store the files? VideoFileDto system or database?**

That’s up to you. A local storage is preferred to a remote one (S3 needs keys for example), but there’s no strong preference between file system and database as long as the API requirements are satisfied. 

**Is any language/framework fine as long as the 'Expectations' are met?**

You can use any language. 

**Is storage meant to be local, cloud-based, or either?**

That’s up to you. Local storage is preferred to a remote one unless you are comfortable with committing keys to your cloud storage (we suggest avoiding this and we are not responsible for any leak of your credentials), but there’s no strong preference between file system and database as long as the API requirements are satisfied.

**Is Unit testing also required?**

It isn't required, but it is nice to have.

**OpenAPI has been used for api specification, is it ok if I use Swagger UI to visualize openapi yaml?**

Yes, it is OK to use swagger UI as long as it doesn't interfere with the main service.

**Do I only have one chance to push to the main branch (or ext-solution branch) of the repository?**

No. That’s your repository and your main branch, we just ask you to keep your commits and PR tidy. If you feel like branching you can also do this, just tell us to check the branch to evaluate your thought process better.



Again, we appreciate you taking the time to work on this challenge and we are looking forward to your submission!

------------------------------------------------------------------------------------------------------------------------------

# Video Storage Server Implementation

## Introduction
This project is a video storage server with REST APIs, which has CRUD implementation as described in the Open API definition. The endpoints of the server are exposed to the host machine.
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
Marius Ngaboyamahina, Senior Software Engineer at [WiredIn](https://wiredin.rw/)
LinkedIn: [Marius Ngaboyamahina](https://www.linkedin.com/in/ntezi/)

