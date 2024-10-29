## Motor-Mart --- Braniac Backend Assessment

This project was built using a class-based architecture to promote a more organized and modular structure. By encapsulating related functionalities within classes, each class can focus on a specific domain, such as User, Car, and Image management, making the code easier to manage and scale.

Prisma was chosen as the ORM because of its intuitive, type-safe query system and strong support for TypeScript. It simplifies database interactions by providing an abstraction layer that reduces the complexity of raw SQL queries while maintaining performance. Prisma's migration system ensures smooth schema evolution, making it easier to maintain and update the database structure as the project grows. Its integration with TypeScript enhances type safety, preventing runtime errors and making the code more robust.

## Stack

- NodeJs (TypeScript & Express)
- Postgres database
- Prisma for ORM
- Cloudinary for image upload
- Postman for API Documentation

## Local Development Setup

- Clone the repository
- Create a `.env` file and fill in the require fields for local development. See `.env.example` for blueprint.
- Run `yarn install` or `yarn` to install all project dependency
- Run `docker compose up` to start all services(core, database, database client) used in this application
- Run `yarn prisma:migrate` to sync models with database
- Connect to database with your choice database client
- Run `yarn dev` to start the application on development environment
- Run `yarn seeder:seed` to populate the database. This would allow for testing the search feature without manually saving data.

## Test Setup
- Complete the local development setup
- Run `yarn test`

## ER Diagram
[https://dbdiagram.io/d/Motor-Mart-671d02f197a66db9a35b96d2](https://dbdiagram.io/d/Motor-Mart-671d02f197a66db9a35b96d2)

## API Documentation

[https://documenter.getpostman.com/view/20628325/2sAY4uD3fK](https://documenter.getpostman.com/view/20628325/2sAY4uD3fK)

## Live URL

[https://motor-mart-2.onrender.com](https://motor-mart-2.onrender.com)
