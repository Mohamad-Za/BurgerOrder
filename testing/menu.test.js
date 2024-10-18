"API Endpoints: Test all endpoints and error handling"
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexRoutes = require('../routes/menuRoutes');
const cli = require('../src/cli');

jest.mock("../src/cli");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/', indexRoutes);

describe('Menu Routes', () => {
    beforeEach(() => {
        cli.showBurgers.mockResolvedValue([{ id: 1, name: 'Burger' }]);
        cli.getBurgerById.mockResolvedValue({ id: 1, name: 'Burger' });
        cli.getBurgerIngredients.mockResolvedValue([{ id: 1, name: 'Lettuce' }]);
        cli.showIngredients.mockResolvedValue([{ id: 1, name: 'Lettuce' }, { id: 2, name: 'Tomato' }]);
        cli.insertOrder.mockResolvedValue(1);
        cli.insertOrderItem.mockResolvedValue();
        cli.insertOrderIngredient.mockResolvedValue();
        cli.getIngredientById.mockResolvedValue({ id: 1, name: 'Lettuce' });
    });

    it('should render the about page', async () => {
        const response = await request(app).get('/about');
        expect(response.status).toBe(200);
        expect(response.text).toContain('About');
    });

    it('should render the menu page', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('menu');
    });

    it('should render the customize page', async () => {
        const response = await request(app).get('/customize/1');
        expect(response.status).toBe(200);
        expect(response.text).toContain('customize');
    });



    it('should process an order', async () => {
        const response = await request(app)
            .post('/order')
            .send({
                customerName: 'Neron',
                burgerId: 1,
                ingredientIds: [1, 2],
                extraIngredientIds: [3],
                quantity: 1
            });
        expect(response.status).toBe(200);
        expect(response.text).toContain('Thank You');

    });
});