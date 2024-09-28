const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const kitchenRoutes = require('./routes/kitchenRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/', kitchenRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const kitchenPort = 1338;
app.listen(kitchenPort, () => {
    console.log(`Kitchen server is running on http://localhost:${kitchenPort}`);
});
