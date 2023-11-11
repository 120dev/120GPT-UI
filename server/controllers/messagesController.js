const { pool } = require('../config');

exports.getMessages = async (req, res) => {
    try {
        const result = await pool.query('SELECT role,content FROM messages ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        res.status(500).send('Erreur lors de la récupération des messages.');
    }
};
