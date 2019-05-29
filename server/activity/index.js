'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const ctrl = require('./activity.controller');
const { NOT_FOUND } = require('http-status-codes');
const processListQuery = require('../shared/util/processListQuery');
const router = require('express-promise-router')();

const processQuery = processListQuery({ order: [['position']] });

router.param('activityId', getActivity);

router
  .route('/')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router
  .route('/:activityId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:activityId/reorder', ctrl.reorder)
  .post('/:activityId/clone', ctrl.clone)
  .get('/:activityId/publish', ctrl.publish);

function getActivity(req, _res, next, activityId) {
  return Activity.findByPk(activityId, { paranoid: false })
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => {
      req.activity = activity;
      next();
    });
}

module.exports = {
  path: '/activities',
  router
};
