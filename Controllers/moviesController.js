const fs = require('fs');
let movies = JSON.parse(fs.readFileSync('./data/movies.json'));

exports.checkId = (req, res, next, value)=>{

    console.log('Movie ID is ' + value);

   // const id = req.params.id * 1;

    const movie = movies.find(el => el.id === value * 1);

  if (movie === undefined){
        return res.status(404).json({
            status: "fail",
            message: "Movie with ID " + value+ " not found"
        })
    }

    next();
}
//Route Handler Functions

//GET-/api/v1/movies
exports.getAllMovies = (req, res)=>{
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
exports.getAnMovie = (req, res)=>{
    const id = req.params.id * 1;
    const movie = movies.find(el => el.id === id);

  //  if (movie === undefined){
  //      return res.status(404).json({
  //          status: "fail",
  //          message: "Movie with ID " + id + " not found"
  //      })
  // }
    res.status(200).json({
        status: "success",
        data:{
            movie: movie
        }
    })
};
//POST - api/v1/movies
exports.postMovie = (req, res)=>{
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
 exports.patchtMovie =  (req, res)=>{
    let id = req.params.id * 1;
    let movieUpdate = movies.find(el => el.id === id);
    
    //if (movieUpdate === undefined){
    //    return res.status(404).json({
    //        status: "fail",
    //        message: "Movie with ID " + id + " not found"
    //    })
    //}

    let index = movies.indexOf(movieUpdate);

    Object.assign(movieUpdate, req.body);
    movies[index] = movieUpdate;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), err=>{
        res.status(200).json({
            status: "success",
            data:{
                movie: movieUpdate
            }
        })
    })
};
//delete - api/v1/movies/id
exports.deleteMovie =  (req, res)=>{
    
    let id = req.params.id * 1;
    let movieDelete = movies.find(el => el.id === id);

    //if (movieDelete === undefined){
    //    return res.status(404).json({
    //        status: "fail",
    //        message: "Movie with ID " + id + " not found"
    //    })
    //  }
    
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
 

