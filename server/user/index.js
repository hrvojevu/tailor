'use strict';

/**
 * User resource.
 * @namespace User
 */

const express = require('express');
const passport = require('passport');
const io = require('../shared/io');
const controller = require('./user.controller').controller;
const model = require('./user.model').model;
const middleware = require('./middleware');
const queryParams = require('../shared/middleware').queryParamParsers;
const { requireCourseAccess } = require('../course/middleware');

const router = express.Router();
const input = io.input();
const output = io.output();

if (process.env.NODE_ENV !== 'production') {
  // Process of creating/inviting users is not fully specified yet, so allow
  // developers to create new users as they see fit.
  router.get('/users',
    input,
    controller.list,
    output);

  router.post('/users',
    input,
    controller.create,
    output);
}

router.post('/users/actions/login',
  input,
  passport.authenticate('local'),
  controller.login,
  output);

router.post('/users/actions/logout',
  input,
  middleware.requireUser,
  controller.logout,
  output);

router.get('/users',
  input,
  controller.list,
  output);

router.get('/users/:userKey',
  input,
  controller.show,
  output);

// TODO(marko): Implement permission checking. Implement role
// checking depending on inviting user.
router.put('/users/:userKey',
  input,
  controller.patch,
  output);

router.get('/courses/:courseKey/users',
  input,
  requireCourseAccess,
  queryParams.parseSearch,
  controller.listUsersForCourse,
  output);

// TODO(marko): Implement permission checking. Implement role
// checking depending on inviting user.
router.post('/users/invite',
  input,
  controller.inviteUserToCourse,
  output
);

router.post('/users/:userKey/access/courses/:courseKey',
  input,
  requireCourseAccess,
  controller.grantAccessToCourse,
  output);

router.delete('/users/:userKey/access/courses/:courseKey',
  input,
  requireCourseAccess,
  controller.revokeAccessToCourse,
  output);

module.exports = {
  controller,
  middleware,
  model,
  router
};
