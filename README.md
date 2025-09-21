# Hotel Booking Application

This is a hotel booking application built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

## Features

- User authentication (registration and login) with JWT.
- Role-based access control (USER and ADMIN roles).
- Users can view their profiles.
- Admins can view all users and delete users.
- Users can book rooms.
- Users can view their bookings.
- Admins can view all bookings.
- Admins can add new rooms.
- Admins can update existing rooms.
- Admins can delete rooms.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [JWT](https://jwt.io/), [Passport](http://www.passportjs.org/)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Validation**: [class-validator](https://www.npmjs.com/package/class-validator), [class-transformer](https://www.npmjs.com/package/class-transformer)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Falasefemi2/hotel-booking-application.git
    ```

2.  Install the dependencies:

    ```bash
    cd hotel-booking-application
    npm install
    ```

3.  Set up the environment variables:

    Create a `.env` file in the root directory and add the following:

    ```
    DATABASE_URL="postgresql://your-username:your-password@localhost:5432/your-database-name"
    JWT_SECRET="your-jwt-secret"
    ```

4.  Run the database migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Log in a user and get a JWT token.

### Users

- `GET /users/all`: Get all users (ADMIN only).
- `GET /users/:email`: Get a user by email (ADMIN and USER).
- `DELETE /users/delete/:email`: Delete a user by email (ADMIN and USER).
- `DELETE /users/delete/by-id/:id`: Delete a user by ID (ADMIN only).

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It consists of the following models:

- **User**: Stores user information, including first name, last name, email, password, and roles.
- **Role**: Stores user roles (e.g., USER, ADMIN).
- **Room**: Stores room information, including room type, price, and booking status.
- **BookedRoom**: Stores information about booked rooms.

## Project Structure

```
.
├── prisma
│   └── schema.prisma
├── src
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── app.module.ts
│   └── main.ts
└── test
```
