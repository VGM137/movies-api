const joi = require('@hapi/joi');

const { movieIdScheme } = require('./movies');
const { userIdScheme } = require('./users');

const userMovieIdScheme = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserMovieScheme = {
  userId: userIdScheme,
  movieId: movieIdScheme
};

module.exports = {
  userMovieIdScheme,
  createUserMovieScheme
}