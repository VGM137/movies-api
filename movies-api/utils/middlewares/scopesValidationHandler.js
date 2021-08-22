const  boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function(req, res, next) {
    if(!req.user || (req.user && !req.user.scopes)){
      next(boom.unauthorized('Missing scopes'))
    }
    console.log(req.user)

    const hasAcces = allowedScopes
      .map(allowedScope => req.user.scopes.scopes.includes(allowedScope))
      .find(allowed => Boolean(allowed))

    if(hasAcces) {
      next();
    } else {
      next(boom.unauthorized('Insuffiecient scopes'))
    }
  }
}

module.exports = scopesValidationHandler;