const MongoLib = require('../lib/mongo');
const debug = require('debug')('app:db')


class MoviesService {
  constructor(){
    this.collection = 'movies'
    this.mongoDB = new MongoLib();
  }
  async getMovies({ tags }){
    const query = tags && { tags: { $in: tags } }
    const movies = await this.mongoDB.getAll(this.collection, query)
    return movies || []
  }

  async getMovie({ movieId }){
    debug('Se están llamando las peliculas')
    const movie = await this.mongoDB.get(this.collection, movieId)
    return movie || {}
  }

  async createMovie({ movie }){
    const createMovieId = await this.mongoDB.create(this.collection, movie)
    return createMovieId;
  }

  async updateMovie({ movieId, movie } = {}){
    const updatedMovieId = await this.mongoDB.update(this.collection, movieId, movie)
    return updatedMovieId;
  }

  async deleteMovie({ movieId }){
    const deletedMovieId = await this.mongoDB.delete(this.collection, movieId)
    return deletedMovieId;
  }

/*   async partialUpdateMovie() {
		const updatedMovieId = await Promise.resolve(moviesMock[0].id);
		return updatedMovieId;
	} */
}

module.exports = MoviesService;