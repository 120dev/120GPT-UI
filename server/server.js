const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const { compress, decompress } = require('./utils/compression');
const createChatCompletion = require('./utils/chatCompletion');
const { pool } = require('./config');
const messagesRoute = require('./routes/messages');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(cors());

// Utilisation des routes
app.use('/', messagesRoute);

const server = app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('message', async (compressedHistory) => {
        try {
            const conversationHistory = decompress(compressedHistory);
            const response = await createChatCompletion(conversationHistory);
            const systemMessage = response[0].message.content;
            const query = 'INSERT INTO messages(role, content) VALUES($1, $2)';
            await pool.query(query, ['user', conversationHistory[conversationHistory.length - 1].content]);
            await pool.query(query, ['system', systemMessage]);
            socket.emit('message', systemMessage);
            // socket.emit('message', '<pre><code>```php<?PHP phpinfo(); ?>```</code></pre>');
        } catch (error) {
            console.error('Erreur lors de l\'appel à OpenAI:', error);
            socket.emit('message', 'Désolé, une erreur est survenue.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});
