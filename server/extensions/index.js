'use strict';

const ctrl = require('./extensions.controller');
const router = require('express').Router();

router
  .post('/extensions', ctrl.install);

module.exports = {
  router
};
