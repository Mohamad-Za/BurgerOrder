"Unit Tests: Test individual functions and methods in isolation"
const mysql = require('promise-mysql');
const cli = require('../src/cli');

jest.mock('promise-mysql');

function normalizeSQL(sql) {
    return sql.replace(/\s+/g, ' ').trim();
}

describe('CLI Functions', () => {
    let db;

    beforeAll(async () => {
        db = {
            query: jest.fn()
        };
        mysql.createConnection.mockResolvedValue(db);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch burgers', async () => {
        const mockBurgers = [{ id: 1, name: 'Burger' }];
        db.query.mockResolvedValue(mockBurgers);

        const result = await cli.showBurgers();
        expect(result).toEqual(mockBurgers);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM burgers');
    });

    it('should fetch ingredients', async () => {
        const mockIngredients = [{ id: 1, name: 'Lettuce' }];
        db.query.mockResolvedValue(mockIngredients);

        const result = await cli.showIngredients();
        expect(result).toEqual(mockIngredients);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM ingredients');
    });

    it('should insert an order', async () => {
        db.query.mockResolvedValue({ insertId: 1 });

        const result = await cli.insertOrder('John Doe');
        expect(result).toEqual(1);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO orders (customer_name) VALUES (?)', ['John Doe']);
    });

    it('should insert an order item', async () => {
        await cli.insertOrderItem(1, 1, 2);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO order_items (order_id, burger_id, quantity) VALUES (?, ?, ?)', [1, 1, 2]);
    });

    it('should insert burger ingredients', async () => {
        db.query.mockResolvedValue([]);
        await cli.insertBurgerIngredients(1, [1, 2]);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?', [1, 1]);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO burger_ingredients (burger_id, ingredient_id) VALUES (?, ?)', [1, 1]);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?', [1, 2]);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO burger_ingredients (burger_id, ingredient_id) VALUES (?, ?)', [1, 2]);
    });

    it('should fetch a burger by ID', async () => {
        const mockBurger = { id: 1, name: 'Burger' };
        db.query.mockResolvedValue([mockBurger]);

        const result = await cli.getBurgerById(1);
        expect(result).toEqual(mockBurger);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM burgers WHERE id = ?', [1]);
    });

    it('should delete an order', async () => {
        await cli.deleteOrder(1);
        expect(db.query).toHaveBeenCalledWith('DELETE FROM orders WHERE id = ?', [1]);
    });

    it('should fetch order details', async () => {
        const mockOrderDetails = [{ id: 1, customerName: 'John Doe', items: [{ name: 'Burger', quantity: 2 }] }];
        db.query.mockResolvedValue(mockOrderDetails);

        const result = await cli.showOrderDetails();
        expect(result).toEqual(mockOrderDetails);
        expect(normalizeSQL(db.query.mock.calls[0][0])).toBe(normalizeSQL(`
            SELECT o.id AS order_id, o.customer_name, o.order_date,
                   b.name AS burger_name, oi.quantity AS burger_quantity,
                   GROUP_CONCAT(i.name SEPARATOR ', ') AS ingredients
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN burgers b ON oi.burger_id = b.id
            LEFT JOIN order_ingredients oi2 ON o.id = oi2.order_id
            LEFT JOIN ingredients i ON oi2.ingredient_id = i.id
            GROUP BY o.id, b.name;
        `));
    });

    it('should fetch burger ingredients', async () => {
        const mockIngredients = [{ id: 1, name: 'Lettuce' }];
        db.query.mockResolvedValue(mockIngredients);

        const result = await cli.getBurgerIngredients(1);
        expect(result).toEqual(mockIngredients);
        expect(normalizeSQL(db.query.mock.calls[0][0])).toBe(normalizeSQL(`
            SELECT i.id, i.name, i.extra_price, bi.quantity
            FROM ingredients i
            JOIN burger_ingredients bi ON i.id = bi.ingredient_id
            WHERE bi.burger_id = ?
        `));
        expect(db.query.mock.calls[0][1]).toEqual([1]);
    });

    it('should insert or update burger ingredient', async () => {
        db.query.mockResolvedValue([]);
        await cli.insertOrUpdateBurgerIngredient(1, 1);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?', [1, 1]);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO burger_ingredients (burger_id, ingredient_id, quantity) VALUES (?, ?, 1)', [1, 1]);
    });

    it('should remove burger ingredient', async () => {
        await cli.removeBurgerIngredient(1, 1);
        expect(db.query).toHaveBeenCalledWith('DELETE FROM burger_ingredients WHERE burger_id = ? AND ingredient_id = ?', [1, 1]);
    });

    it('should insert order ingredient', async () => {
        await cli.insertOrderIngredient(1, 1, 2);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO order_ingredients (order_id, ingredient_id, quantity) VALUES (?, ?, ?)', [1, 1, 2]);
    });

    it('should fetch ingredient by ID', async () => {
        const mockIngredient = { id: 1, name: 'Lettuce' };
        db.query.mockResolvedValue([mockIngredient]);

        const result = await cli.getIngredientById(1);
        expect(result).toEqual(mockIngredient);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM ingredients WHERE id = ?', [1]);
    });
});