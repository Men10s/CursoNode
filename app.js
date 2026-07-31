//Import package

import express from 'express';
import fs from 'fs';
import morgan from 'morgan';

let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.js'));

const logger = function(req, res, next){
    console.log('Custom middleware called');
    next();
}

app.use(express.json());
app.use(morgan('combined'));
app.use(logger)
app.use((req, res, next)=>{
    req.requestedAt = new Date().toISOString();
    next();
})

//Route Handler Functions

//GET-/api/v1/movies
const getAllMovies = (req, res)=>{
    res.status(200).json({
        status: "sucess",
        requestedAt: req.requestedAt,
        count: movies.length,
        data:{
            movies: movies
        }
    })
};

//GET-/api/v1/movies/id
const getAnMovie = (req, res)=>{
    const id = req.params.id * 1;
    const movie = movies.find(el => el.id === id);

    if (movie === undefined){
        return res.status(404).json({
            status: "fail",
            message: "Movie with ID " + id + " not found"
        })
    }
    res.status(200).json({
        status: "success",
        data:{
            movie: movie
        }
    })
};

//POST - api/v1/movies
const postMovie = (req, res)=>{
    console.log(req.body);

    const newId = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({id: newId}, req.body);
    movies.push(newMovie);
    fs.writeFile('./data/movies.js', JSON.stringify(movies), err=>{
        res.status(201).json({
            status: "success",
            data:{
                movie: newMovie
            }
        })
    })
};

//patch - api/v1/movies/id
const patchtMovie =  (req, res)=>{
    let id = req.params.id * 1;
    let movieUpdate = movies.find(el => el.id === id);
    if (movieUpdate === undefined){
        return res.status(404).json({
            status: "fail",
            message: "Movie with ID " + id + " not found"
        })
    }
    let index = movies.indexOf(movieUpdate);

    Object.assign(movieUpdate, req.body);
    movies[index] = movieUpdate;
    fs.writeFile('./data/movies.js', JSON.stringify(movies), err=>{
        res.status(200).json({
            status: "success",
            data:{
                movie: movieUpdate
            }
        })
    })
};

//delete - api/v1/movies/id
const deleteMovie =  (req, res)=>{
    
    let id = req.params.id * 1;
    let movieDelete = movies.find(el => el.id === id);

    if (movieDelete === undefined){
        return res.status(404).json({
            status: "fail",
            message: "Movie with ID " + id + " not found"
        })
    }
    
    const index = movies.indexOf(movieDelete);

    movies.splice(index, 1);
    fs.writeFile('./data/movies.js', JSON.stringify(movies), err=>{
        res.status(200).json({
            status: "success",
            data:{
                movie: movieDelete
            }
        })
    })
}

const moviesBuffer = express.Router();

moviesBuffer.route( '/')
   .get(getAllMovies)
   .post(postMovie)

moviesBuffer.route('/:id')
   .get(getAnMovie)
   .patch(patchtMovie)
   .delete(deleteMovie);

app.use('/api/v1/movies',moviesBuffer)

//Create a Server
const port = 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})
