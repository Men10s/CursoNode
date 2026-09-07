// import express from 'express';

//Route Handler Functions

const express = require('express');
const moviesController = require('../Controllers/moviesController');

const router = express.Router();

router.route('/movies-stats').get(moviesController.getMovieStats);
router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);
router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies);
router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.postMovie);

router.route('/:id')
    .get(moviesController.getAnMovie)
    .patch(moviesController.patchtMovie)
    .delete(moviesController.deleteMovie);

module.exports = router;