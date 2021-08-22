const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeyService = require('../services/apiKeys');
const UsersService = require('../services/users');
const validationHandler = require('../utils/middlewares/validationHandler');

const { createUserScheme } = require('../utils/schemes/users');

const { config } = require('../config');
/* const UsersService = require('../services/users'); */

//BasicStrategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeyService();
  const usersService = new UsersService();

  router.post('/sign-in', async function(req, res, next){
    const { apiKeyToken } = req.body;

    if(!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function(error, user){
      console.log('Autenticating')
      console.log(user)
      try {
        if (error || !user){
          console.log('error')
          return next(boom.unauthorized());
        }
        
        req.login(user, { session: false }, async function(error){
          if(error){
            next(error)
          }
          
          const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });
          console.log(apiKey)
          
          if(!apiKey){
            next(boom.unauthorized());
          }

          const { _id: id, name, email } = user;
          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes
          };
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          });

          return res.status(200).json({ token, user: { id, name, email }})
        })
      }catch(error){
        next(error);
      }
    })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createUserScheme), async function(req, res, next){
    const { body: user } = req;

    try {

      const userExists = await usersService.verifyUserExists(user)

      if(userExists) {
          res.send({
              message: 'user already exists'
          })
          return
      }
  
      const createdUserId = await usersService.createUser({ user });

      res.status(201).json({
        data: createdUserId,
        message: 'User created'
      })
    } catch (error) {
      next(error)
    }
  })
};

module.exports = authApi;