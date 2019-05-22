'use strict';

module.exports = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || null,
  ssl: Boolean(process.env.EMAIL_SSL),
  tls: Boolean(process.env.EMAIL_TLS)
};