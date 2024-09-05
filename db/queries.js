const pool = require('./pool');

async function createUser(username, firstname, lastname, password){
    await pool.query(`
        INSERT INTO users
        (username, firstname, lastname, password)
        VALUES ($1, $2, $3, $4)
        `, [username, firstname, lastname, password]);
}

module.exports = {
    createUser,
}