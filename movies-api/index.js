const express = require('express');
const app = express()
const debug = require('debug')('app:server')
 
const { config } = require('./config/index');

const authApi = require('./routes/auth');
const moviesApi = require('./routes/movies');
const userMoviesApi = require('./routes/userMovies')

const { 
  logError,
  wrapError,
  errorHandler 
} = require('./utils/middlewares/errorHandler.js')

const notFoundHandler = require('./utils/middlewares/notFoundHandler.js');

// body parser middleware
app.use(express.json());

// routes
authApi(app)
moviesApi(app);
userMoviesApi(app)

//Catch 404
app.use(notFoundHandler)

//Error middleware
app.use(logError);
app.use(wrapError);
app.use(errorHandler);

app.listen(config.port, function(){
  console.log(`Listening http://localhost:${config.port}`)
});
