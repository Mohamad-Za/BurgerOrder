
const express = require('express');
const router = express.Router();
const cli = require('../src/cli');
const app = express();


router.get('/about', (req, res) => {
    let data = {};
    data.title = "About";
    
    // List of team members with their GitHub profile picture and GitHub links
    data.team = [
        { name: "Mohamad Zahedi", githubUrl: "https://github.com/Mohamad-Za", avatarUrl: "https://github.com/Mohamad-Za.png" },
        { name: "Member 2", githubUrl: "https://github.com/member2-profile", avatarUrl: "https://github.com/member2-profile.png" },
        { name: "Member 3", githubUrl: "https://github.com/member3-profile", avatarUrl: "https://github.com/member3-profile.png" },
        { name: "Member 4", githubUrl: "https://github.com/member4-profile", avatarUrl: "https://github.com/member4-profile.png" },
        { name: "Member 5", githubUrl: "https://github.com/member5-profile", avatarUrl: "https://github.com/member5-profile.png" }
    ];

    res.render('burger_orderer/pages/about', data);
});



// Display the main menu with all burgers
router.get('/', async (req, res, next) => {
    try {
        let data = {};
        data.title = "menu";
        data.burgers = await cli.showBurgers();
        res.render('burger_orderer/pages/menu', data);
    } catch (err) {
        next(err);  // Pass the error to the error handler
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Display a specific burger for customization (by ID)
router.get('/customize/:id', async (req, res) => {
    let data = {};
    data.title = "customize";
    const burgerId = req.params.id;

    // Fetch burger by ID and its associated default ingredients
    data.burger = await cli.getBurgerById(burgerId);
    data.defaultIngredients = await cli.getBurgerIngredients(burgerId);  // Fetch default ingredients
    data.allIngredients = await cli.showIngredients();  // Fetch all available ingredients for adding/removing
    data.title = `Customize ${data.burger.name}`;

    res.render('burger_orderer/pages/customize', data);
});




// Display the thank you page after placing an order
router.get('/thankyou', (req, res) => {
    let data = {};
    data.title = "thank you";
    res.render('burger_orderer/pages/thankyou', data);
});


// Display all orders for the kitchen
router.get('/orders', async (req, res) => {
    let data = {};
    data.title = "orders";

    try {
        // Fetch all order details with burgers and ingredients
        data.orders = await cli.showOrderDetails();
        res.render('burger_orderer/pages/orders', data);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Failed to retrieve orders.");
    }
});



// Place an order with the selected ingredients
router.post('/order', async (req, res) => {
    const { customerName, burgerId, ingredientIds, extraIngredientIds, quantity } = req.body;

    try {
        // Step 1: Insert the order and get the order ID
        const orderId = await cli.insertOrder(customerName);

        // Step 2: Insert the selected burger into order_items with the user-defined quantity
        await cli.insertOrderItem(orderId, burgerId, quantity || 1);  // Use the quantity from the user or default to 1

        // Step 3: Handle default ingredients (removal if unchecked)
        let selectedIngredients = [];
        if (ingredientIds) {
            for (let ingredientId of ingredientIds) {
                await cli.insertOrderIngredient(orderId, ingredientId, 1);
                const ingredient = await cli.getIngredientById(ingredientId);
                selectedIngredients.push(ingredient);
            }
        }

        // Step 4: Handle additional ingredients (added by the user)
        if (extraIngredientIds) {
            for (let extraIngredientId of extraIngredientIds) {
                await cli.insertOrderIngredient(orderId, extraIngredientId, 1);
                const extraIngredient = await cli.getIngredientById(extraIngredientId);
                selectedIngredients.push(extraIngredient);
            }
        }

        // Get burger details
        const burger = await cli.getBurgerById(burgerId);

        // Redirect to thank you page with order details
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






// Your routes go here, including the POST route for deleting an order
router.post('/orders/delete/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log("Attempting to delete order with ID:", req.params.id);

    try {
        await cli.deleteOrder(orderId);  // Call function to delete order
        res.redirect('/orders');  // Redirect after deletion
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send("Failed to delete order.");
    }
});


module.exports = router;