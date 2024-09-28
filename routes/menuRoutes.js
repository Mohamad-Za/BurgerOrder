
const express = require('express');
const router = express.Router();
const cli = require('../src/cli');
const app = express();


router.get('/about', (req, res) => {
    let data = {};
    data.title = "About";
    
    data.team = [
        { name: "Mohamad Zahedi", githubUrl: "https://github.com/Mohamad-Za", avatarUrl: "https://github.com/Mohamad-Za.png" },
        { name: "Member 2", githubUrl: "https://github.com/member2-profile", avatarUrl: "https://github.com/member2-profile.png" },
        { name: "Member 3", githubUrl: "https://github.com/member3-profile", avatarUrl: "https://github.com/member3-profile.png" },
        { name: "Member 4", githubUrl: "https://github.com/member4-profile", avatarUrl: "https://github.com/member4-profile.png" },
        { name: "Member 5", githubUrl: "https://github.com/member5-profile", avatarUrl: "https://github.com/member5-profile.png" }
    ];

    res.render('burger_orderer/pages/about', data);
});



router.get('/', async (req, res, next) => {
    try {
        let data = {};
        data.title = "menu";
        data.burgers = await cli.showBurgers();
        res.render('burger_orderer/pages/menu', data);
    } catch (err) {
        next(err);  
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


router.get('/customize/:id', async (req, res) => {
    let data = {};
    data.title = "customize";
    const burgerId = req.params.id;

    data.burger = await cli.getBurgerById(burgerId);
    data.defaultIngredients = await cli.getBurgerIngredients(burgerId); 
    data.allIngredients = await cli.showIngredients(); 
    data.title = `Customize ${data.burger.name}`;

    res.render('burger_orderer/pages/customize', data);
});




router.get('/thankyou', (req, res) => {
    let data = {};
    data.title = "thank you";
    res.render('burger_orderer/pages/thankyou', data);
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

        res.render('burger_orderer/pages/thankyou', {
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