import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '00693',
  database: 'postgres'  
});

async function createDatabase() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE mydb;');
    console.log('Database "mydb" created successfully!');
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();