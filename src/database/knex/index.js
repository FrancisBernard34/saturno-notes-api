const path = require('path');
const config = require(path.resolve(__dirname, '../../../knexfile'));
const knex = require("knex")(config.development);

module.exports = knex;