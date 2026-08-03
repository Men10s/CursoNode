// import express from 'express';
const express = require('express');
const moviesController = require('../Controllers/moviesController');

const router = express.Router();

router.param('id', moviesController.checkId);
router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.postMovie);

router.route('/:id')
    .get(moviesController.getAnMovie)
    .patch(moviesController.patchtMovie)
    .delete(moviesController.deleteMovie);

module.exports = router;