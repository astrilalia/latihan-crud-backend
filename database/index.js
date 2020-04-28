const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'astrilalia',
    password: 'Ulyssesmoore7',
    database: 'moviesindoxxi',
    port: 3306
})

module.exports = db