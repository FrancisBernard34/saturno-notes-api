const sqliteConnection = require('../../sqlite')

const createUsers = require('./createUsers')
const createNotes = require('./createNotes')
const createTags = require('./createTags')
const createLinks = require('./createLinks')

async function migrationsRun() {
  const schemas = [
    createUsers,
    createNotes,
    createTags,
    createLinks
  ].join('')

  return sqliteConnection().then(database => database.exec(schemas))
  .catch(err => {
    console.error('Migration error:', err);
    throw err;
  });
}

module.exports = migrationsRun