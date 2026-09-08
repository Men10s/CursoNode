
const Movie = require('./../Models/movieModel');
const ApiFeatures = require('./Utils/ApiFeatures');
//GET-/api/v1/movies

exports.getHighestRated = (req, res, next) => {
    console.log('GET HIGHEST-RATED');
    req.movieQuery = {
        ...req.query,
        limit: '5',
        sort: '-ratings'
    };
    next();
};

exports.getAllMovies = async (req, res) => {

    try {
        const requestQuery = req.movieQuery || req.query;
        const features = new ApiFeatures(Movie.find(), requestQuery)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const movies = await features.query;

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }   
};

//GET-/api/v1/movies/id
exports.getAnMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

//POST - api/v1/movies
exports.postMovie = async (req, res) => {
    try {
        if (!req.body || (typeof req.body === 'object' && !Array.isArray(req.body) && Object.keys(req.body).length === 0)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Request body is empty. Send a JSON movie with Content-Type: application/json.'
            });
        }

        const newMovie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movies: newMovie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

//patch - api/v1/movies/id
exports.patchtMovie =  async (req, res) => {
    try {
       const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
       
       if (!updatedMovie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }
        
       res.status(200).json({
           status: 'success',
           data: {
               movie: updatedMovie
           }
       });
    }
    catch (error){
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

//delete - api/v1/movies/id
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }

        res.status(204).json();
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getMovieStats = async (req, res) => {
    try {
        const stats = await Movie.aggregate([
                {$match: {ratings: {$gte: 0}}},
                {$group: {_id: null, 
                 averageRating: {$avg: '$ratings'},
                 avperagePrice: {$avg: '$price'},
                 minPrice: {$min: '$price'},
                 maxPrice: {$max: '$price'}, 
                averageTime: {$avg: '$duration'},
                minTime: {$min: '$duration'},
                maxTime: {$max: '$duration'}
            }},
                
        ]);

        res.status(200).json({
            status: 'success',
            length: stats.length,
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getMovieByGenre = async (req, res) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            { $unwind: "$genres"},
            { $group: { _id: "$genres", movieCount:{$sum: 1},movies:{$push: '$name'}}},
            { $match: { _id: genre } }
 ]);

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
