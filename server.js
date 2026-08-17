const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

console.log(process.env);


//Create a Server
const port = process.env.PORT || 3000;
let message = "Server is started";

app.listen(port, ()=>{
    console.log(message);
})