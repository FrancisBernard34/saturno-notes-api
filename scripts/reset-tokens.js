const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');

async function resetDatabase() {
  const dbPath = path.resolve(__dirname, '..', 'src', 'database', 'database.db');
  const envPath = path.resolve(__dirname, '..', '.env');

  // Generate a new random secret
  const newSecret = crypto.randomBytes(64).toString('hex');

  // Update .env file with new secret
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    /AUTH_SECRET=.*/, 
    `AUTH_SECRET=${newSecret}`
  );
  fs.writeFileSync(envPath, envContent);

  // Check if database file exists
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Existing database file deleted.');
  }

  // Run Knex migrations
  return new Promise((resolve, reject) => {
    exec('npx knex migrate:latest', (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration error: ${error}`);
        reject(error);
        return;
      }
      
      console.log('Database reset and migrations applied successfully.');
      console.log('All previous JWT tokens have been invalidated by changing the secret.');
      console.log('New secret generated and stored in .env file.');
      resolve();
    });
  });
}

resetDatabase().catch(console.error);
