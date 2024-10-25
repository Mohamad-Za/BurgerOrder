const path = require('path');
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? path.resolve(__dirname, '.env.test') : process.env.NODE_ENV === 'docker' ? path.resolve(__dirname, '...env.docker') : path.resolve(__dirname, '.env.local') });


const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
};

module.exports = config;