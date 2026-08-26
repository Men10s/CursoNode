const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});

const app = require('./app');

//console.log(process.env);
mongoose.connect(process.env.CONN_STR).then(()=>{
    console.log('DB connection Sucessfull')
}).catch((error)=>{
    console.error('DB connection failed:', error.message);
});

//Create a Server
const port = process.env.PORT || 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})