
const Movie = require('./../Models/movieModel');

//GET-/api/v1/movies
exports.getAllMovies = async (req, res) => {

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
        const newMovie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movie: newMovie
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
exports.patchtMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

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