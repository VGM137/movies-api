const express = require('express');
const MoviesService = require('../services/movies')


const {
  movieIdScheme,
  createMovieScheme,
  updateMovieScheme
} = require('../utils/schemes/movies.js');

const validationHandler = require('../utils/middlewares/validationHandler.js');

const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router)
  
  const moviesService = new MoviesService()

  router.get('/', async function(req, res, next){
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
    const { tags } = req.query
    try{
      const movies = await moviesService.getMovies({ tags });
/*       throw new Error('Error encontrando las peliculas') */

      res.status(200).json({
        data: movies,
        message: 'movies listed'
      });
    }catch(err){
      next(err);
    }
  });
  router.get('/:movieId', validationHandler({ movieId: movieIdScheme }, 'params'), async function(req, res, next){
    cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
    const { movieId } = req.params;
    try{
      const movie = await moviesService.getMovie({ movieId });

      res.status(200).json({
        data: movie,
        message: 'Movie retrived'
      });
    }catch(err){
      next(err);
    }
  });

  router.post('/', validationHandler(createMovieScheme), async function(req, res, next){
    const { body: movie } = req;
    try{
      const createdMovieId = await moviesService.createMovie({ movie });

      res.status(201).json({
        data: createdMovieId,
        message: 'movie created'
      });
    }catch(err){
      next(err);
    }
  });

  router.put('/:movieId', validationHandler({ movieId: movieIdScheme }, 'params'), validationHandler(updateMovieScheme), async function(req, res, next){
    const { movieId } = req.params;
    const { body: movie } = req;
    try{
      const updatedMovieId = await moviesService.updateMovie({ 
        movieId,
        movie
      });

      res.status(200).json({
        data: updatedMovieId,
        message: 'movie updated'
      });
    }catch(err){
      next(err);
    }
  });

  router.delete('/:movieId', validationHandler({ movieId: movieIdScheme }, 'params'), async function(req, res, next){
    const { movieId } = req.params;
    try{
      const deletedMovie = await moviesService.deleteMovie({ movieId });

      res.status(200).json({
        data: deletedMovie,
        message: 'movie deleted'
      });
    }catch(err){
      next(err);
    }
  });

  router.patch("/:movieId", async function(req,res,next) {
		const { movieId } = req.params;
		const { body: movie } = req;		
		try {
			const updatedMovieId = await moviesService.partialUpdateMovie({ movieId, movie });

			res.status(200).json({
				data:updatedMovieId,
				message: "movie updated partially"
			});
		}
		catch(error) {
			next(error);
		}
	});
}

module.exports = moviesApi