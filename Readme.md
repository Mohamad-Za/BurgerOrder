

## Project Overview

This is a multi-container Node.js application designed for ordering burgers, featuring two main views: the Kitchen view (`kitchen.js`) and the Menu view (`menu.js`). The application uses MariaDB as the database, with Docker containerizing the app and database for easy setup in various environments.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (optional, if running the app outside Docker)

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

- **Menu View**: Accessible at `http://localhost:4000`
- **Kitchen View**: Accessible at `http://localhost:3000`

You can modify the ports as needed within the `docker-compose.yml` file.

### Docker Services in `docker-compose.yml`

- **MariaDB**: Stores order and menu data.
- **Node.js**: Runs the application, handling both `menu.js` and `kitchen.js`.

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

The Menu and Kitchen views will be available at `http://localhost:4000` and `http://localhost:3000`, respectively.

---

## Running Tests

This project uses Jest for testing the routes and functionality of the application.

### Step 1: Install Jest and Supertest

If you haven't installed Jest or Supertest yet, run:

```bash
npm install jest supertest
```

### Step 2: Run the Tests

To run the test suite, use the following commands:

```bash
npm test menu.test.js
npm test kitchen.test.js
npm test functions.test.js
npm test databaseOperations.test.js
```

These tests mock database interactions and validate routes for both views (`menu.js` and `kitchen.js`).

---

## Notes on Testing

- **Unit Tests**: Check individual functions and methods.
- **Integration Tests**: Ensure that different parts of the application work seamlessly together.
- **Performance Tests**: Performance issues may arise under high load, particularly when handling more than 8 requests per second.

---

## Running Artillery Performance Tests

To ensure that the application performs well under load, we use [Artillery](https://artillery.io/) to simulate multiple requests and measure performance.

### Step 1: Install Artillery

If Artillery isn't installed globally, you can install it via npm:

```bash
npm install -g artillery
```

### Step 2: Run the Performance Test

```bash
artillery run performance-test.yml
```

This will simulate traffic and provide performance metrics for the application.

---

## Troubleshooting

- **Database Connection Issues**: Ensure the MariaDB container is up and running before accessing the application. Verify with:

  ```bash
  docker-compose ps
  ```

- **Port Conflicts**: If ports `3000` or `4000` are in use, you can change them in the `docker-compose.yml` file.

---

## Conclusion

This README provides the steps to run and test the Burger Order application using Docker. For any issues or contributions, feel free to open a pull request or create an issue in the repository.

