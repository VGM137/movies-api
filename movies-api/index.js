const express = require('express');
const helmet = require('helmet')
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
//Helmet por default protege la aplicacion con una configuración predeterminada pero si queremos aplicar propiedades solo hay que ingresar un archivo de configuración entre los parentesis.
app.use(helmet())

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
