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

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

router.get('/', async (req, res) => {
    res.redirect("/orders")
});


router.get('/orders', async (req, res) => {
    let data = {};
    data.title = "orders";

    try {
        data.orders = await cli.showOrderDetails();
        res.render('burger_orderer/pages/orders', data);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Failed to retrieve orders.");
    }
});



router.post('/orders/delete/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log("Attempting to delete order with ID:", req.params.id);

    try {
        await cli.deleteOrder(orderId);  
        res.redirect('/orders');  
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).send("Failed to delete order.");
    }
});


module.exports = router;
