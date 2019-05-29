'use strict';

const ctrl = require('./te.controller');
const processQuery = require('../shared/util/processListQuery')();
const router = require('express-promise-router')();

router
  .route('/')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router
  .route('/:teId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:teId/reorder', ctrl.reorder);

module.exports = {
  path: '/tes',
  router
};
