'use strict';

const { auth: config } = require('../../../../config/server');
const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const times = (length, cb) => Array.from({ length }, (_, i) => cb(i));

const now = new Date();
const users = [];

times(5, i => {
  const suffix = i || '';
  users.push({
    email: `admin${suffix}@extensionengine.com`,
    password: 'admin123.',
    role: 'ADMIN',
    created_at: now,
    updated_at: now
  });
});

module.exports = {
  up(queryInterface) {
    return Promise.map(users, user => encryptPassword(user))
      .then(users => queryInterface.bulkInsert('user', users, {}));
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('user', null, {});
  }
};

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
