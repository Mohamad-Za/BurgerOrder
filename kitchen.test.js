const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const kitchenRoutes = require('./routes/kitchenRoutes');
const cli = require('./src/cli');

jest.mock('./src/cli');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/', kitchenRoutes);

// Global error handler for testing
app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

describe('Kitchen Routes', () => {
    beforeEach(() => {
        cli.showOrderDetails.mockResolvedValue([{ id: 1, customerName: 'John Doe', items: [{ name: 'Burger', quantity: 2 }] }]);
        cli.deleteOrder.mockResolvedValue();
    });

    it('should render the about page', async () => {
        const response = await request(app).get('/about');
        expect(response.status).toBe(200);
        expect(response.text).toContain('About');
    });

    it('should redirect to /orders', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/orders');
    });

    it('should render the orders page', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.text).toContain('orders');
    });

    it('should handle error when fetching orders', async () => {
        cli.showOrderDetails.mockRejectedValue(new Error('Failed to retrieve orders'));
        const response = await request(app).get('/orders');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Failed to retrieve orders');
    });

    it('should delete an order and redirect to /orders', async () => {
        const response = await request(app).post('/orders/delete/1');
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/orders');
    });

    it('should handle error when deleting an order', async () => {
        cli.deleteOrder.mockRejectedValue(new Error('Failed to delete order'));
        const response = await request(app).post('/orders/delete/1');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Failed to delete order');
    });
});