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

async function createMessage(message, user_id) {
    await pool.query(`
        INSERT INTO messages
        (message, user_id)
        VALUES ($1, $2)
        `, [message, user_id]);
}

async function getAllMessages(){
    const {rows} = await pool.query(`
                                SELECT messages.*, users.username  
                                FROM messages
                                INNER JOIN users
                                ON messages.user_id = users.id
                            `);
    return rows;
}

module.exports = {
    createUser,
    toggleMembership,
    toggleAdmin,
    createMessage,
    getAllMessages
}