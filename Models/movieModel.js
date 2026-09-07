const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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
  }, 
  createdBy: {
    type: String,
    required: [true, 'A movie must have a creator'],
    default: 'Mendes',
  }
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
  }
);

movieSchema.virtual('durationInHours').get(function() {
  return this.duration / 60;
} );

movieSchema.post('save', function(doc) {
  const content = `Document saved: ${doc.name} has been saved by ${doc.createdBy} at ${new Date().toISOString()}\n`;
  const logPath = path.join(__dirname, '..', 'log', 'log.txt');
  fs.appendFileSync(logPath, content);
});
//Executed before the document is saved to the database
//save or create

movieSchema.pre(/^find/, function() {
  this.find({ releaseDate: { $lte: Date.now() } });
});

movieSchema.post(/^find/, function(docs) {
  const logPath = path.join(__dirname, '..', 'log', 'log.txt');
  const content = `Documents retrieved: ${docs.length} documents found at ${new Date().toISOString()}\n`;
  fs.appendFileSync(logPath, content);
}
);
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;