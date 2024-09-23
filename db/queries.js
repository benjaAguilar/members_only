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

async function getMessage(id) {
    const {rows} = await pool.query(`
        SELECT messages.*, users.username  
        FROM messages
        JOIN users ON messages.user_id = users.id
        WHERE messages.id = $1
    `, [id]);

    return rows;
}

async function deleteMessage(id){
    await pool.query(`
            DELETE FROM messages
            WHERE id = $1
        `, [id]);
}

async function increaseLikes(id){
    await pool.query(
        `UPDATE messages SET likes = likes + 1                
        WHERE id = $1
        `, [id]);
}

async function getMessageComments(id){
    const { rows } = await pool.query(`
            SELECT comments.*, users.username FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE message_id = $1
        `, [id]);
    
    return rows;
}

async function insertComment(user_id, message_id, content){
    await pool.query(`
            INSERT INTO comments
            (user_id, message_id, content)
            VALUES ($1, $2, $3)
        `, [user_id, message_id, content]);
}

module.exports = {
    createUser,
    toggleMembership,
    toggleAdmin,
    createMessage,
    getAllMessages,
    deleteMessage,
    increaseLikes,
    getMessageComments,
    getMessage,
    insertComment
}