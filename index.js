const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Import routes
const indexRoutes = require('./routes/indexRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded bodies (for form submissions)
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (CSS, JS)
app.use(express.static('public'));

app.set('view engine', 'ejs');  // Set EJS as the templating engine

// Mount the routes (use indexRoutes for all routes)
app.use('/', indexRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const port = 1337;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});