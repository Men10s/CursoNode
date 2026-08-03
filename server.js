const app = require('./app');

//Create a Server

const port = 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})