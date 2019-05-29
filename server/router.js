'use strict';

const auth = require('passport').authenticate('jwt');
const course = require('./course');
const express = require('express');
const storage = require('./shared/storage/storage.router');
const user = require('./user');

const router = express.Router();
router.use(processBody);

// Public routes:
router.use(user.path, user.router);

// Protected routes:
router.use(auth);
router.use(course.path, course.router);
router.use(storage.path, storage.router);

module.exports = router;

function processBody(req, res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
