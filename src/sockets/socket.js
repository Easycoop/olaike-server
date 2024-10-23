// sockets/socket.js
const { Server } = require('socket.io');
const { Message } = require('../database/models/index');

let users = {};

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

        // When a user connects, associate their userId with their socketId
        socket.on('register', (userId) => {
            users[userId] = socket.id; // Store the userId and socketId in the users object
            console.log(`User ${userId} connected with socket ID ${socket.id}`);
        });

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
        socket.on('sendDirectMessage', async (messageData) => {
            const { senderId, recipientId, content } = messageData;

            try {
                const newMessage = await Message.create({
                    senderId,
                    recipientId,
                    content,
                    userId: senderId,
                    status: 'sent',
                });

                const recipientSocketId = users[recipientId];
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('directMessage', newMessage);
                    console.log(`Direct message sent from ${socket.id} to ${recipientId}:`, content);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Handle typing indicator
        socket.on('typing', (userId) => {
            socket.broadcast.emit('typing', { userId });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Remove the user from the users object when they disconnect
            for (let userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
        });
    });

    return io;
};

module.exports = { initializeSocketIO };
