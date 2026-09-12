const Movie = require('./../Models/movieModel');
const ApiFeatures = require('../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/AsyncErrorHandler');

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

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
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
});

//GET-/api/v1/movies/id
exports.getAnMovie = asyncErrorHandler(async (req, res) => {
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
});

//POST - api/v1/movies
exports.postMovie = asyncErrorHandler(async (req, res) => {
    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    });
});

//patch - api/v1/movies/id
exports.patchtMovie = asyncErrorHandler(async (req, res) => {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

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
});

//delete - api/v1/movies/id
exports.deleteMovie = asyncErrorHandler(async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
        return res.status(404).json({
            status: 'fail',
            message: 'No movie found with that ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMovieStats = asyncErrorHandler(async (req, res) => {
    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 0 } } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$ratings' },
                avperagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                averageTime: { $avg: '$duration' },
                minTime: { $min: '$duration' },
                maxTime: { $max: '$duration' }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        length: stats.length,
        data: {
            stats
        }
    });
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res) => {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        { $unwind: "$genres" },
        { $group: { _id: "$genres", movieCount: { $sum: 1 }, movies: { $push: '$name' } } },
        { $match: { _id: genre } }
    ]);

    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies
        }
    });
});