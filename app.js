//Import package

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
let app = express();
const logger = function(req, res, next){
    console.log('Custom middleware called');
    next();}
app.use(express.json());
app.use(express.static('./public'))
app.use(morgan('combined'));
app.use(logger);
app.use((req, res, next)=>{
    req.requestedAt = new Date().toISOString();
    next();
});
const moviesBuffer = express.Router();
//Using Routes
app.use('/api/v1/movies', moviesRouter)

module.exports = app;