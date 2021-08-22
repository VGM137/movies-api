const boom = require('@hapi/boom');
const { config } = require('../../config');

function withErrorStack(error, stack){
  if(config.dev){
    return { ...error, stack };
  }
  
  return error;
}

function logError(err, req, res, next){
  console.log(err);
  next(err);
}

//Middleware para determinar si el error es de tipo boom
function wrapError(err, req, res, next){
  if(!err.isBoom){
    next(boom.badImplementation(err))
  }

  next(err)
}

function errorHandler(err, req, res, next){
  const { output: { statusCode, payload } } = err

  /* res.status(err.status || 500);
  res.json(withErrorStack(err.message, err.stack)); */
  //De la siguiente manera se regresa el error con boom:
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logError,
  wrapError,
  errorHandler
};