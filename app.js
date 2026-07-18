//Import package

const { count } = require('console');
const express = require('express');
const fs = require('fs');
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.js'));

app.get('/api/v1/movies', (req, res)=>{
    res.status(200).json({
        status: "sucess",
        count: movies.lenght,
        data:{
            movies: movies
        }
    })
})

//Create a Server
const port = 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})