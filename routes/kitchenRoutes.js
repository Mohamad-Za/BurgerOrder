const express = require('express');
const router = express.Router();
const cli = require('../src/dbConnection.js');
const app = express();

router.get('/about', (req, res, next) => {
    try {
        let data = {};
        data.title = "About";
        
        data.team = [
            { name: "Mohamad Zahedi", githubUrl: "https://github.com/Mohamad-Za", avatarUrl: "https://github.com/Mohamad-Za.png" },
            { name: "Senai Ammanuel tewoldmedhin", githubUrl: "https://github.com/amanuelsen", avatarUrl: "https://github.com/amanuelsen.png" },
            { name: "Khaled Mkahala", githubUrl: "https://github.com/KokoobiGO", avatarUrl: "https://github.com/KokoobiGO.png" },
            { name: "Stefan Crnobrnja", githubUrl: "https://github.com/MilosObelic", avatarUrl: "https://github.com/MilosObelic.png" },
            { name: "Neron Haxhiu", githubUrl: "https://github.com/NeronHaxhiu", avatarUrl: "https://github.com/NeronHaxhiu.png" }
        ];

        res.render('burger_orderer/pages/about', data);
    } catch (error) {
        next(error);
    }
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});

router.get('/', async (req, res, next) => {
    try {
        res.redirect("/orders");
    } catch (error) {
        next(error);
    }
});

router.get('/orders', async (req, res, next) => {
    let data = {};
    data.title = "orders";

    try {
        data.orders = await cli.showOrderDetails();
        res.render('burger_orderer/pages/orders', data);
    } catch (error) {
        next(error);
    }
});

router.post('/orders/delete/:id', async (req, res, next) => {
    const orderId = req.params.id;
    console.log("Attempting to delete order with ID:", req.params.id);

    try {
        await cli.deleteOrder(orderId);  
        res.status(200).redirect('/orders');  
    } catch (error) {
        res.status(500).send("Failed to delete order");
        next(error);
    }
});

module.exports = router;