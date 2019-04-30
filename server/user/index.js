'use strict';

const auth = require('passport').authenticate('jwt');
const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

router
  // Public routes:
  .post('/users/login', ctrl.login)
  .post('/users/forgotPassword', ctrl.forgotPassword)
  .post('/users/resetPassword', ctrl.resetPassword)
  // Protected routes:
  .use(auth)
  .post('/users/me/change-password', ctrl.changePassword)
  .patch('/users/me', ctrl.updateProfile)
  .get('/users', ctrl.index);

module.exports = {
  model,
  router
};
