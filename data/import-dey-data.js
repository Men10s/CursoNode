const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Movie = require('./../Models/movieModel');

dotenv.config({path: path.join(__dirname, '..', 'config.env')});


//READ MOVIES.JSON FILE
const movies = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf-8'));
//DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION 
const deleteMovies = async () => {
    try{  
      await Movie.deleteMany();
      console.log('All movies successfully deleted.');
    }catch(err){
      console.error(err.message);
    }

    process.exit();
 }

 //IMPORT MOVIES DATA TO MONGODB COLLECTION

 const importMovies = async () =>{
    try{
      await Movie.create(movies);
      console.log('Data successfully imported!');
    }catch(err){
      console.error(err.message);
    }

    process.exit();
 }

const run = async () => {
  try {
    await mongoose.connect(process.env.CONN_STR);
    console.log('DB connection successful');

    if (process.argv[2] === '--import') {
      await deleteMovies();
      await importMovies();
    } else if (process.argv[2] === '--delete') {
      await deleteMovies();
    } else {
      console.log('Use --import or --delete.');
    }
  } catch (error) {
    console.error('DB connection failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
  process.exit();
};

run();