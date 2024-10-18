
# Burger Order Application - Docker Setup

## Project Overview

This is a multi-container Node.js application built for ordering burgers with two main views: the Kitchen view (`kitchen.js`) and the Menu view (`menu.js`). The application uses MariaDB as the database. Docker is used to containerize the app and the database for easy setup across different environments.

## Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running the app outside Docker, optional)

## Getting Started with Docker

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-repo/BurgerOrder.git
cd BurgerOrder
```

### Step 2: Docker Compose Setup

The `docker-compose.yml` file orchestrates both the Node.js application and the MariaDB database.

1. Unzip the project files (if zipped).
2. In the project root, run:

```bash
docker-compose up --build
```

This will pull the necessary Docker images, set up the MariaDB database, and run both `menu.js` and `kitchen.js`.

### Step 3: Access the Application

- Menu View: The Menu view can be accessed at `http://localhost:3000`
- Kitchen View: The Kitchen view can be accessed at `http://localhost:3001`

You can modify the ports if necessary within the `docker-compose.yml` file.

### Docker Services in `docker-compose.yml`

- **MariaDB**: Stores order and menu data.
- **Node.js**: Runs the application, including both `menu.js` and `kitchen.js`.

### Step 4: Stopping the Application

To stop the Docker containers, run:

```bash
docker-compose down
```

---

## Running the Application Without Docker (Optional)

If you prefer to run the application locally without Docker:

1. Install Node.js if not already installed.
2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   node menu.js
   node kitchen.js
   ```

The Menu and Kitchen views will be available at `http://localhost:3000` and `http://localhost:3001`, respectively.

---

## Running Tests

This project uses Jest for testing the routes and functionality of the application.

### Step 1: Install Jest and Supertest

If you haven't installed Jest or Supertest yet, run:

```bash
npm install jest supertest
```

### Step 2: Run the Tests

To run the test suite, use the following command:

```bash
npm test
```

This will execute the tests located in files like `menu.test.js` and `kitchen.test.js`. These test files mock database interactions and test the routes for both views.

---

## Notes on Testing

- **Unit Tests**: Check individual functions and methods.
- **Integration Tests**: Ensure that different parts of the application work seamlessly together.
- **Performance Tests**: Performance issues under high load have been observed, particularly when handling more than 8 requests per second.

---

## Troubleshooting

- **Database Connection Issues**: Make sure the MariaDB container is up and running before accessing the application. You can verify with:

  ```bash
  docker-compose ps
  ```

- **Port Conflicts**: If ports `3000` or `3001` are in use, you can change them in the `docker-compose.yml` file.

---

## Conclusion

This README provides the steps to run and test the Burger Order application using Docker. For any issues or contributions, feel free to open a pull request or create an issue in the repository.
