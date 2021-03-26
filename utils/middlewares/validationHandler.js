const boom = require('@hapi/boom')
const joi = require('@hapi/joi')

function validation(data, schema){
  const { error } = joi.object(schema).validate(data);
  return error
}

function validationHandler(schema, check = 'body'){
  return function(req, res, next){
    const error = validation(req[check], schema);

    error ? next(boom.badRequest(error)) : next();
  }
}

module.exports = validationHandler;