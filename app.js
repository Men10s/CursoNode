//Import package

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
let app = express();
app.set('query parser', 'extended');
const logger = function(req, res, next){
    console.log('Custom middleware called');
    next();}
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.static('./public'))
app.use(logger);
app.use((req, res, next)=>{
    req.requestedAt = new Date().toISOString();
    next();
});
const moviesBuffer = express.Router();
//Using Routes

app.use('/api/v1/movies', moviesRouter)
app.all('/{*splat}', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
})

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && error.body !== undefined) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid JSON. Escape line breaks and tabs inside strings.'
        });
    }

    next(error);
});

module.exports = app;