# Second Hand Market API

A RESTful API for a second-hand market application built with Node.js, Express, and PostgreSQL. This application allows users to register, log in, and manage items for sale with full CRUD operations and search functionality. This project is part of the HackYourFuture curriculum.

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Item Management**: Full CRUD operations for items (Create, Read, Update, Delete)
- **Search Functionality**: Search items by various criteria
- **Database Integration**: PostgreSQL database with automatic table creation
- **Database Mimicking**: Mimicking the database in RAM if the actual one is not available
- **Security**: Password hashing with bcrypt and JWT authentication
- **Testing**: Jest-based unit and acceptance tests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **PostgreSQL** (version 12 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd c53-node-js-test-YaroslavKazeev
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Update the variables in the `ChangeMe.env` file following instructions there
   - Rename `ChangeMe.env` to `.env`

4. **Start PostgreSQL service**
   Make sure PostgreSQL is running on your system. The application automatically creates a PostgreSQL database named "Second hand market app DB" and the necessary tables:

- `users` table for user authentication
- `items` table for item management
  If the PostgreSQL service is not available, the app will run in non-persistent save mode (database mimicking)

## 🚀 Running the Application

### Development Mode / Production Mode

```bash
npm run dev / npm start
```

The server will start on port `7890`. You can access the API at `http://localhost:7890`.

## 📚 API Endpoints

### Authentication

- `POST /users/register` - Register a new user
- `POST /users/login` - Login user

Request body should have credentials in this format:

```json
{ "email": "123@gmail.com", "password": "12345678" }
```

### Items Management

- `GET /items` - Get all user's items
- `POST /items` - Create a new item
- `PATCH /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

Request body for the POST and PATCH operations should have item details in this format:

```json
{ "title": "Luxury Car", "price": 9999.99 }
```

The ID in the path for PATCH and DELETE operations can be obtained from the response body of the GET and POST operations.

All item management operations require JWT to be sent in the Authorization HTTP header with Bearer. JWT can be obtained from the response body of the user login operation.

### Search

- `GET /search?q={keyword}` - filter item titles according to a keyword from all database.

## 🧪 Testing

Run the test suite / Run acceptance tests:

```bash
npm test / npm run test-acceptance
```

## 📁 Project Structure

```
├── app.js                 # Main application setup
├── index.js              # Server entry point
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create from ChangeMe.env)
├── config/
│   └── SQLdb_Init.js     # Database initialization
├── controllers/
│   ├── dbController.js   # Database operations
│   ├── itemsController.js # Items CRUD operations
│   ├── searchController.js # Search functionality
│   └── usersController.js # User authentication
├── routes/
│   ├── items.js          # Items routes
│   ├── search.js         # Search routes
│   └── users.js          # User routes
├── Tests/
│   └── sample.test.js    # Unit tests
└── dummy-data.json       # Sample data
```

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error handling and logging

## 👨‍💻 Author

**Yaroslav Kazeev**

## 🔗 Dependencies

### Production Dependencies

- `express`: Web framework
- `pg`: PostgreSQL client
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT authentication
- `dotenv`: Environment variable management

### Development Dependencies

- `jest`: Testing framework
- `supertest`: HTTP testing
- `nodemon`: Development server
- `@babel/preset-env`: Babel configuration
