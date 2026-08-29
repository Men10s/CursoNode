const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A movie must have a name'],
        unique: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, 'A movie must have a duration'],
    },
    rating: {
        type: Number,
        required: [true, 'A movie must have a rating'],
        min: [0, 'Rating must be above 0'],
        max: [10, 'Rating must be below 10']
    },
    releaseDate: {
        type: Date,
        required: [true, 'A movie must have a release date'],
    },
    genre: {
        type: String,
        required: [true, 'A movie must have a genre'],
        trim: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;