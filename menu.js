const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/menuRoutes');

app.use(bodyParser.urlencoded({ extended: true }));  
app.use(express.static(path.join(__dirname, 'public')));  
app.use(express.static('public'));

app.set('view engine', 'ejs');  

app.use('/', indexRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});