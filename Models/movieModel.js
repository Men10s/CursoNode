const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A movie must have a name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A movie must have a duration'],
  },
  ratings: {
    type: Number,
    default: 1.0
  },
  totalRating: { // No vídeo está "totalRating" no singular
    type: Number,
    default: 0
  },
  releaseYear: Number,
  releaseDate: {
    type: Date,
    required: [true, 'A movie must have a release date'],
  },
  genres: {
    type: [String],
    required: [true, 'A movie must have genres'],
  }, 
  directors: [String],
  coverImage: {
    type: String,
    required: [true, 'A movie must have a cover image'],
  },
  actors: {
    type: [String],
    required: [true, 'A movie must have actors'],
  },   
  price: {
    type: Number,
    required: [true, 'A movie must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;