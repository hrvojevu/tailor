'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express-promise-router')();

const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/')
  .get(ctrl.getUrl)
  .post(upload.single('file'), ctrl.upload);

module.exports = {
  path: '/asset',
  router
};
