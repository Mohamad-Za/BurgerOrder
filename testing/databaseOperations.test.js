"Database Operations: Test all CRUD operations and edge cases"
const mysql = require('promise-mysql');
const config = require('../config/db/config');
const cli = require('../src/cli');

describe('Database Operations', () => {
    let db;

    beforeAll(async () => {
        // Create a connection to the MySQL server (without specifying a database)
        const serverConnection = await mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            multipleStatements: config.multipleStatements
        });

        // Drop and create the test database
        await serverConnection.query('DROP DATABASE IF EXISTS burger_orderer_test');
        await serverConnection.query('CREATE DATABASE burger_orderer_test');

        // Close the server connection
        await serverConnection.end();

        // Create a connection to the test database
        db = await mysql.createConnection(config);
        await db.query('USE burger_orderer_test');

        // Create the necessary tables
        await db.query(`
            CREATE TABLE burgers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL
            );
        `);
        await db.query(`
            CREATE TABLE ingredients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                extra_price DECIMAL(10, 2) NOT NULL
            );
        `);
        await db.query(`
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255),
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await db.query(`
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                burger_id INT,
                quantity INT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (burger_id) REFERENCES burgers(id)
            );
        `);
        await db.query(`
            CREATE TABLE burger_ingredients (
                burger_id INT,
                ingredient_id INT,
                quantity INT DEFAULT 1,
                PRIMARY KEY (burger_id, ingredient_id),
                FOREIGN KEY (burger_id) REFERENCES burgers(id) ON DELETE CASCADE,
                FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
            );
        `);
        await db.query(`
            CREATE TABLE order_ingredients (
                order_id INT,
                ingredient_id INT,
                quantity INT DEFAULT 1,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
            );
        `);
    });

    afterAll(async () => {
        await db.query('DROP DATABASE burger_orderer_test');
        await db.end();
    });

    afterEach(async () => {
        await db.query('DELETE FROM order_ingredients');
        await db.query('DELETE FROM burger_ingredients');
        await db.query('DELETE FROM order_items');
        await db.query('DELETE FROM orders');
        await db.query('DELETE FROM ingredients');
        await db.query('DELETE FROM burgers');
    });

    it('should insert and fetch burgers', async () => {
        await db.query('INSERT INTO burgers (name, description, price) VALUES (?, ?, ?)', ['Burger', 'Delicious burger', 5.99]);
        const burgers = await cli.showBurgers();
        expect(burgers).toEqual([{ id: 1, name: 'Burger', description: 'Delicious burger', price: 5.99 }]);
    });

    it('should insert and fetch ingredients', async () => {
        await db.query('INSERT INTO ingredients (name, extra_price) VALUES (?, ?)', ['Lettuce', 0.5]);
        const ingredients = await cli.showIngredients();
        expect(ingredients).toEqual([{ id: 1, name: 'Lettuce', extra_price: 0.5 }]);
    });

    it('should insert an order', async () => {
        const orderId = await cli.insertOrder('John Doe');
        const orders = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        expect(orders).toEqual([{ id: orderId, customer_name: 'John Doe', customer_email: null, order_date: expect.any(Date) }]);
    });

 



    it('should delete an order', async () => {
        const orderId = await cli.insertOrder('John Doe');
        await cli.deleteOrder(orderId);
        const orders = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        expect(orders).toEqual([]);
    });
});