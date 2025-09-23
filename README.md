# Hotel Booking Application

This is a hotel booking application built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications.

## Features

-   **User Authentication**: Secure user authentication using JWT, including registration and login.
-   **Role-Based Access Control (RBAC)**: Differentiated user roles (USER and ADMIN) to manage access to different API endpoints.
-   **User Management**: Users can view their profiles, and administrators can view and delete all users.
-   **Room Management**: Administrators can add, update, and delete hotel rooms.
-   **Booking Management**: Users can book rooms, view their bookings, and administrators can view all bookings.
-   **Database Seeding**: A script is provided to seed the database with initial data for roles.

## Technologies Used

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [JWT](https://jwt.io/), [Passport](http://www.passportjs.org/)
-   **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
-   **Validation**: [class-validator](https://www.npmjs.com/package/class-validator), [class-transformer](https://www.npmjs.com/package/class-transformer)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher)
-   [npm](https://www.npmjs.com/)
-   [PostgreSQL](https://www.postgresql.org/download/)

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

### Seeding the Database

To seed the database with initial data (e.g., user roles), run the following command:

```bash
npx prisma db seed
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

-   `POST /auth/signup`: Register a new user.
    -   **Request Body**: `{ "firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "password": "password123" }`
-   `POST /auth/login`: Log in a user and get a JWT token.
    -   **Request Body**: `{ "email": "john.doe@example.com", "password": "password123" }`

### Users

-   `GET /users/all`: Get all users (ADMIN only).
-   `GET /users/:email`: Get a user by email (ADMIN and USER).
-   `DELETE /users/delete/:email`: Delete a user by email (ADMIN and USER).
-   `DELETE /users/delete/by-id/:id`: Delete a user by ID (ADMIN only).

### Roles

-   `POST /roles/create`: Create a new role (ADMIN only).
    -   **Request Body**: `{ "name": "SUPERADMIN" }`
-   `GET /roles/all`: Get all roles (ADMIN only).
-   `POST /roles/assign`: Assign a role to a user (ADMIN only).
    -   **Request Body**: `{ "userEmail": "john.doe@example.com", "roleName": "ADMIN" }`

### Rooms

-   `POST /rooms/create`: Create a new room (ADMIN only).
    -   **Request Body**: `{ "roomType": "Deluxe", "roomPrice": 250, "photo": "image-url" }`
-   `GET /rooms/all`: Get all rooms.
-   `GET /rooms/:id`: Get a room by ID.
-   `PUT /rooms/update/:id`: Update a room by ID (ADMIN only).
    -   **Request Body**: `{ "roomType": "Suite", "roomPrice": 300 }`
-   `DELETE /rooms/delete/:id`: Delete a room by ID (ADMIN only).

### Bookings

-   `POST /bookedroom/book-room/:roomId`: Book a room.
    -   **Request Body**: `{ "guestName": "Jane Doe", "guestEmail": "jane.doe@example.com", "checkInDate": "2024-12-25", "checkOutDate": "2024-12-30", "noOfAdults": 2, "noOfChildren": 1 }`
-   `GET /bookedroom/all`: Get all bookings (ADMIN only).
-   `GET /bookedroom/view-booking/:bookingId`: Get a booking by ID.
-   `DELETE /bookedroom/cancel-booking/:bookingId`: Cancel a booking.

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It consists of the following models:

-   **User**: Stores user information, including first name, last name, email, password, and roles.
-   **Role**: Stores user roles (e.g., USER, ADMIN).
-   **Room**: Stores room information, including room type, price, and booking status.
-   **BookedRoom**: Stores information about booked rooms.

## Project Structure

```
.
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── auth
│   ├── bookedroom
│   ├── common
│   ├── roles
│   ├── rooms
│   ├── users
│   ├── app.module.ts
│   └── main.ts
└── test
```

## Testing

To run the tests, use the following command:

```bash
npm run test
```

To run the end-to-end tests, use the following command:

```bash
npm run test:e2e
```

## License

This project is licensed under the MIT License.