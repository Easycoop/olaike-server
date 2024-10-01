//CLIENT SIDE INTEGRATION

// Example client-side Socket.io usage
const socket = io('http://localhost:5000'); // Update with your server's URL

// Join a chatroom
socket.emit('joinChatroom', 'chatroomId123');

// Send a message
socket.emit('sendMessage', {
    chatroomId: 'chatroomId123',
    message: { text: 'Hello, everyone!', senderId: currentUser.id },
});

// Listen for messages
socket.on('message', (message) => {
    console.log('New message received:', message);
});

// Sending a direct message
socket.emit('sendDirectMessage', {
    recipientId: 'recipientSocketId', // The socket ID of the user you want to send the message to
    message: { text: 'Hello!', senderId: currentUser.id },
});

// Listening for direct messages
socket.on('directMessage', (message) => {
    console.log('Direct message received:', message);
});

// Typing indicator
const inputField = document.getElementById('messageInput');
inputField.addEventListener('input', () => {
    socket.emit('typing', currentUser.id);
});

// Listen for typing indication
socket.on('typing', (data) => {
    console.log(`User ${data.userId} is typing...`);
});
