const express = require('express');
const app = express()
const debug = require('debug')('app:server')
 
const { config } = require('./config/index');
const moviesApi = require('./routes/movies');

const { 
  logError,
  wrapError,
  errorHandler 
} = require('./utils/middlewares/errorHandler.js')

const notFoundHandler = require('./utils/middlewares/notFoundHandler.js');

// body parser middleware
app.use(express.json());

moviesApi(app);

//Catch 404
app.use(notFoundHandler)

//Error middleware
app.use(logError);
app.use(wrapError);
app.use(errorHandler);

app.listen(config.port, function(){
  debug(`Listening http://localhost:${config.port}`)
});
