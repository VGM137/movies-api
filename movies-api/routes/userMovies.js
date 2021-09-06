const express = require('express');
const passport = require('passport');

const UserMoviesService = require('../services/userMovies');
const validationHandler = require('../utils/middlewares/validationHandler');
const scopesValidationHandler = require('../utils/middlewares/scopesValidationHandler')

const { movieIdScheme } = require('../utils/schemes/movies')
const { userIdScheme } = require('../utils/schemes/users')
const { createUserMovieScheme } = require('../utils/schemes/userMovies');

require('../utils/auth/strategies/jwt');

function userMovieApi(app) {
  const router = express.Router();
  app.use('/api/user-movies', router);

  const userMoviesService = new UserMoviesService();

  router.get(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['read:user-movies']),
    validationHandler({userId: userIdScheme}, 'query'),
    async function(req, res, next) {
      const { userId } = req.query;

      try{
        const userMovies = await userMoviesService.getUserMovies({ userId });
        res.status(200).json({
          data: userMovies,
          message: 'user movies listed'
        });
      }catch(error){
        next(error);
      }
  });

  router.post(
    '/', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['create:user-movies']),
    validationHandler(createUserMovieScheme), 
    async function(req, res, next) {
      const { body: userMovie } = req;

      try{
        const createdUserMovieId = await userMoviesService.createUserMovie({
          userMovie
        });
        console.log(createdUserMovieId)

        res.status(201).json({
          data: createdUserMovieId,
          message: 'user movie created'
        })
      } catch(error){
        next(error);
      }
  });

  router.delete(
    '/:userMovieId', 
    passport.authenticate('jwt', { session: false }), 
    scopesValidationHandler(['delete:user-movies']),
    validationHandler({ userMovieId: movieIdScheme }, 'params'),
    async function(req, res, next){
      const { userMovieId } = req.params;

      try{
        const deleteUserMovieId = await userMoviesService.deleteUserMovie({
          userMovieId
        });

        res.status(200).json({
          data: deleteUserMovieId,
          message: 'user movie deleted'
        })
      }catch(error){
        next(error)
      }
    });
  }

module.exports = userMovieApi;