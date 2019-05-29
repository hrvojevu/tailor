'use strict';

const auth = require('passport').authenticate('jwt');
const ctrl = require('./user.controller');
const router = require('express-promise-router')();

router
  // Public routes:
  .post('/login', ctrl.login)
  .post('/forgotPassword', ctrl.forgotPassword)
  .post('/resetPassword', ctrl.resetPassword)
  // Protected routes:
  .use(auth)
  .get('/', ctrl.index);

module.exports = {
  path: '/users',
  router
};
