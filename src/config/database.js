const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'bbi_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10s
  acquireTimeout: 10000  // 10s
};

// Create Connection Pool
const pool = mysql.createPool(dbConfig);

// Pool Events for Debugging
pool.on('connection', (connection) => {
  console.log('DB: New connection established');
});

pool.on('enqueue', () => {
  console.log('DB: Waiting for available connection slot');
});

pool.on('release', (connection) => {
  // console.log('DB: Connection released');
});

// Wrapper to mimic SQLite3 callback API
const db = {
  run: function(sql, params = [], callback) {
    // Replace ? with ? but MySQL uses ? too, so standard params work.
    // However, SQLite AUTOINCREMENT is different syntax in CREATE TABLE.
    pool.query(sql, params, function(err, results, fields) {
      if (callback) {
        // SQLite 'this' context in callback has lastID and changes
        const context = {
          lastID: results ? results.insertId : null,
          changes: results ? results.affectedRows : 0
        };
        callback.call(context, err);
      }
    });
  },
  
  get: function(sql, params = [], callback) {
    pool.query(sql, params, function(err, results) {
      if (err) {
        if (callback) callback(err, null);
      } else {
        // SQLite get returns single row or undefined
        if (callback) callback(null, results[0]);
      }
    });
  },
  
  all: function(sql, params = [], callback) {
    pool.query(sql, params, function(err, results) {
      if (callback) callback(err, results);
    });
  },

  serialize: function(callback) {
    // MySQL is async by default, we can just execute callback
    if (callback) callback();
  }
};

// Initialize tables with MySQL syntax
const initDatabase = () => {
    console.log('Initializing MySQL Database...');
    
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('CRITICAL: Database connection failed during initialization:', err.code, err.message);
        return;
      }
      console.log('DB: Successfully connected to database for initialization.');
      connection.release();
      
      createTables();
    });
};

const createTables = () => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Berita table
    db.run(`
      CREATE TABLE IF NOT EXISTS berita (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        title_en VARCHAR(255),
        slug VARCHAR(255) UNIQUE NOT NULL,
        summary TEXT,
        summary_en TEXT,
        content LONGTEXT NOT NULL,
        content_en LONGTEXT,
        image VARCHAR(255),
        category VARCHAR(50) DEFAULT 'umum',
        published BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Robust Migration: Try to add columns, ignore if they already exist
    const addColumnSafe = (table, colName, colDef) => {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${colName} ${colDef}`, [], (err) => {
        // Ignore error 1060 (Duplicate column name)
        if (err && err.errno !== 1060) {
          // console.log(`Note: Column ${colName} might already exist or could not be added: ${err.message}`);
        } else if (!err) {
          console.log(`Migration: Successfully added column ${colName} to ${table}`);
        }
      });
    };

    addColumnSafe('berita', 'title_en', 'VARCHAR(255)');
    addColumnSafe('berita', 'summary_en', 'TEXT');
    addColumnSafe('berita', 'content_en', 'LONGTEXT');

    // Cabang table
    db.run(`
      CREATE TABLE IF NOT EXISTS cabang (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(100),
        map_link TEXT,
        map_embed TEXT,
        image VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Unit Bisnis table
    db.run(`
      CREATE TABLE IF NOT EXISTS unit_bisnis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        image VARCHAR(255),
        link VARCHAR(255),
        order_num INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        \`key\` VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        \`read\` BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        berita_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        content TEXT NOT NULL,
        approved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (berita_id) REFERENCES berita(id) ON DELETE CASCADE
      )
    `);

    // Create default admin
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Check if admin exists first
    db.get('SELECT * FROM users WHERE email = ?', ['admin@bbi.com'], (err, admin) => {
      if (!err && !admin) {
        db.run('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
          ['admin@bbi.com', hashedPassword, 'Administrator', 'admin'],
          (err) => {
            if (!err) console.log('Default admin created: admin@bbi.com / admin123');
            else console.error('Error creating admin:', err);
          }
        );
      }
    });

    console.log('MySQL Database initialization commands sent.');
};

module.exports = { db, initDatabase, pool, dbConfig };
