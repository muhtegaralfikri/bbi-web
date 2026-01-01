const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

// Load env specific to the user's project location
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bbi_db',
  port: process.env.DB_PORT || 3306
});

console.log('Connecting to database...');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`DB: ${process.env.DB_NAME}`);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected successfully.');

  const columns = [
    { name: 'title_en', type: 'VARCHAR(255)' },
    { name: 'summary_en', type: 'TEXT' },
    { name: 'content_en', type: 'LONGTEXT' }
  ];

  let completed = 0;

  columns.forEach(col => {
    // Try adding column without IF NOT EXISTS for better compatibility
    const query = `ALTER TABLE berita ADD COLUMN ${col.name} ${col.type}`;
    
    connection.query(query, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${col.name} already exists.`);
        } else {
          console.error(`Error adding column ${col.name}:`, err.message);
        }
      } else {
        console.log(`Successfully added column ${col.name}.`);
      }
      
      completed++;
      if (completed === columns.length) {
        console.log('Migration completed.');
        connection.end();
      }
    });
  });
});
