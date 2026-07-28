//Import package

import express from 'express';
import fs from 'fs';
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.js'));

app.use(express.json());

//Route Handler Functions
const getAllMovies = (req, res)=>{
    res.status(200).json({
        status: "sucess",
        count: movies.length,
        data:{
            movies: movies
        }
    })
};

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
//GET-/api/v1/movies

app.get('/api/v1/movies', getAllMovies)

//GET-/api/v1/movies/id

app.get('/api/v1/movies/:id', getAnMovie);

//POST - api/v1/movies
app.post('/api/v1/movies', postMovie);

//patch - api/v1/movies/id
app.patch('/api/v1/movies/:id', patchtMovie)

//delete - api/v1/movies/id
app.delete('/api/v1/movies/:id', deleteMovie)

//Create a Server
const port = 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})