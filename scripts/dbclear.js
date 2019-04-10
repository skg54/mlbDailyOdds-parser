var mysql    = require('mysql2');

var dbconfig = require('../config/database');

// Script for dropping the entire database
var conn = mysql.createConnection(dbconfig.connection);

conn.query('DROP DATABASE ' + dbconfig.database);

console.log('Success! Database cleared.');
conn.end();
