//Import package

const express = require('express');

let app = express();
let message="Server as started";
const port = 3000;
//Route Method + URL

app.get('/', (req, res)=>{
    res.json({meassage:"Hello word", status: 200});
})
//Create a Server
app.listen(port, ()=>{
    console.log(message);
})