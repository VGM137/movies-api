const { config } = require('../config');

function cacheResponse(res, seconds){
    if(process.env.NODE_ENV == 'production'){
      res.set('Cache-Control', `public, max-age=${seconds}`);
  }
}

module.exports = cacheResponse;