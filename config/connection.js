
'use strict'

var util = require('util');
var mysql = require('mysql');
var dotvenv = require('dotenv').config();

var pool = mysql.createPool({
	connectionLimit: process.env.DB_CONNECTIONLIMIT,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: process.env.DB_MULTIPLESTATEMENETS
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
});

pool.query = util.promisify(pool.query);

module.exports = pool;
