'use strict';

function install({ body }, res) {
  const { name } = body;

  console.log(`Installing ${name}....`);

  res.end();
}

module.exports = {
  install
};
