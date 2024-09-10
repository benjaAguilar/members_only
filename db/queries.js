const pool = require('./pool');

async function createUser(username, firstname, lastname, password){
    await pool.query(`
        INSERT INTO users
        (username, firstname, lastname, password)
        VALUES ($1, $2, $3, $4)
        `, [username, firstname, lastname, password]);
}

async function toggleMembership(id, bool){
    await pool.query(`
        UPDATE users
        SET member = ${bool}
        WHERE id = $1
        `, [id]);
}

async function toggleAdmin(id, bool){
    await pool.query(`
        UPDATE users
        SET admin = ${bool}
        WHERE id = $1
        `, [id]);
}

module.exports = {
    createUser,
    toggleMembership,
    toggleAdmin
}