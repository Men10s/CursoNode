//Import package

const { count } = require('console');
const express = require('express');
const fs = require('fs');
let app = express();
let movies = JSON.parse(fs.readFileSync('./data/movies.js'));

//GET-/api/v1/movies
app.get('/api/v1/movies', (req, res)=>{
    res.status(200).json({
        status: "sucess",
        count: movies.length,
        data:{
            movies: movies
        }
    })
})
//GET-/api/v1/movies/id
app.get('/api/v1/movies/:id', (req, res)=>{
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
});

//POST - api/v1/movies
app.use(express.json());
app.post('/api/v1/movies', (req, res)=>{
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
})
//
app.patch('/api/v1/movies/:id', (req, res)=>{
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
})

//Create a Server
const port = 3000;
let message = "Server is started";
app.listen(port, ()=>{
    console.log(message);
})