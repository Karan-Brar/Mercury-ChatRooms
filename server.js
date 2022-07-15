// Importing Express, path, http module
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

// Initializing an express application, http server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting up middleware that allows express app to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Run a callback function when a client connects
io.on('connection', (socket) => {
    // Sent to the client
    socket.emit('message', 'Welcome to Mercury!');

    // Sent to everyone but the client
    socket.broadcast.emit('message', 'A new user has joined the chat!');

    socket.on('disconnect', () => {
        // Sent to everyone
        io.emit('message', 'A user has disconnected from the chat!');
    });

    
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });

});

// The port at which express app can be accessed
const PORT = 3000 || process.ENV.PORT;

// Making the express app listen at the port
server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));