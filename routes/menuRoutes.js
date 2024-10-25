const express = require('express');
const router = express.Router();
const cli = require('../src/dbConnection.js');

router.get('/about', (req, res) => {
    let data = {};
    data.title = "About";
    
    data.team = [
        { name: "Mohamad Zahedi", githubUrl: "https://github.com/Mohamad-Za", avatarUrl: "https://github.com/Mohamad-Za.png" },
        { name: "Senai Ammanuel tewoldmedhin", githubUrl: "https://github.com/amanuelsen", avatarUrl: "https://github.com/amanuelsen.png" },
        { name: "Khaled Mkahala", githubUrl: "https://github.com/KokoobiGO", avatarUrl: "https://github.com/KokoobiGO.png" },
        { name: "Stefan Crnobrnja", githubUrl: "https://github.com/MilosObelic", avatarUrl: "https://github.com/MilosObelic.png" },
        { name: "Neron Haxhiu", githubUrl: "https://github.com/NeronHaxhiu", avatarUrl: "https://github.com/NeronHaxhiu.png" }
    ];

    res.status(200).render('burger_orderer/pages/about', data);
});

router.get('/', async (req, res, next) => {
    try {
        let data = {};
        data.title = "menu";
        data.burgers = await cli.showBurgers();
        res.status(200).render('burger_orderer/pages/menu', data);
    } catch (err) {
        next(err);  
    }
});

router.get('/customize/:id', async (req, res) => {
    let data = {};
    data.title = "customize";
    const burgerId = req.params.id;

    data.burger = await cli.getBurgerById(burgerId);
    data.defaultIngredients = await cli.getBurgerIngredients(burgerId); 
    data.allIngredients = await cli.showIngredients(); 
    data.title = `Customize ${data.burger.name}`;
    
    res.status(200).render('burger_orderer/pages/customize', data);
});

router.get('/thankyou', (req, res) => {
    let data = {};
    data.title = "thank you";
    res.status(200).render('burger_orderer/pages/thankyou', data);
});

router.post('/order', async (req, res) => {
    const { customerName, burgerId, ingredientIds, extraIngredientIds, quantity } = req.body;

    try {
        const orderId = await cli.insertOrder(customerName);
        await cli.insertOrderItem(orderId, burgerId, quantity || 1);  

        let selectedIngredients = [];
        if (ingredientIds) {
            for (let ingredientId of ingredientIds) {
                await cli.insertOrderIngredient(orderId, ingredientId, 1);
                const ingredient = await cli.getIngredientById(ingredientId);
                selectedIngredients.push(ingredient);
            }
        }

        if (extraIngredientIds) {
            for (let extraIngredientId of extraIngredientIds) {
                await cli.insertOrderIngredient(orderId, extraIngredientId, 1);
                const extraIngredient = await cli.getIngredientById(extraIngredientId);
                selectedIngredients.push(extraIngredient);
            }
        }

        const burger = await cli.getBurgerById(burgerId);

        res.status(200).render('burger_orderer/pages/thankyou', {
            title: 'Thank You',
            burger: burger,
            ingredients: selectedIngredients,
            customerName: customerName
        });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).send("Failed to process order.");
    }
});

module.exports = router;