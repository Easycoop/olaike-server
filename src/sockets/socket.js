// sockets/socket.js
const { Server } = require('socket.io');

const initializeSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS.split(','),
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Handle connection
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle user joining a chatroom
        socket.on('joinChatroom', (chatroomId) => {
            socket.join(chatroomId);
            console.log(`User ${socket.id} joined chatroom: ${chatroomId}`);
        });

        // Handle messaging to chat room
        socket.on('sendMessage', (messageData) => {
            const { chatroomId, message } = messageData;
            io.to(chatroomId).emit('message', message);
            console.log(`Message sent to ${chatroomId}:`, message);
        });

        // Handle direct messaging to other users
        socket.on('sendDirectMessage', (messageData) => {
            const { recipientId, message } = messageData;
            io.to(recipientId).emit('directMessage', message);
            console.log(`Direct message sent from ${socket.id} to ${recipientId}:`, message);
        });

        // Handle typing indicator
        socket.on('typing', (userId) => {
            socket.broadcast.emit('typing', { userId });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = { initializeSocketIO };
