
const Movie = require('./../Models/movieModel');

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
        console.log('URL:', req.originalUrl);
        console.log('QUERY:', requestQuery);
        /*
        Mongoose 6.0 or less does not support query string filtering directly, so we need to create a query object and remove any fields that are not relevant to the query.
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        *************************************************/

        const queryParams = { ...requestQuery };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryParams[field]);

        let queryStr = JSON.stringify(queryParams);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryObj = JSON.parse(queryStr);
        //console.log(queryObj);

        let query = Movie.find(queryObj);
        //find(duration: { $gte: 120 }, rating: { $gte: 7.0 }, price: { $lte: 100 }).
        
        if(requestQuery.sort){
            const sortBy = requestQuery.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
        }else{
            query = query.sort('name');
        }
        if(requestQuery.fields){
            const fields = requestQuery.fields.split(',').join(' ');
            console.log("fields");
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }

        const page = requestQuery.page * 1 || 1;
        const limit = requestQuery.limit * 1 || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        const movies = await query;
        
        if(requestQuery.page) {
            const numMovies = await Movie.countDocuments();
            if(skip >= numMovies) throw new Error('This page does not exist');
        }
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