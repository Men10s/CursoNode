const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.CONN_STR)
    .then(() => {
        console.log('DB connection successful');
    })
    .catch((error) => {
        console.error('DB connection failed:', error.message);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is started');
});