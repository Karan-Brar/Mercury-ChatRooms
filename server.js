// Importing Express, path, http, socket.io and utlity modules
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getUser, getRoomUsers, userLeaveRoom} = require('./utils/users')

// Initializing an express application, http server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting up middleware that allows express app to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'MercuryBot';

// Run a callback function when a client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
       const user = userJoin(socket.id, username, room) 

       // enabling room functionality
       socket.join(user.room);

      // Sent to the client
      socket.emit("message", formatMessage(botName, "Welcome to Mercury!"));

      // Sent to everyone but the client
      socket.broadcast.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat!`)
      );

      // Send updated users list and room info to the room a user has joined
      io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
    })


    socket.on('chatMessage', (msg) => {
        const currentUser = getUser(socket.id); 
        io.to(currentUser.room).emit('message', formatMessage(currentUser.username,msg));
    });

    
    socket.on("disconnect", () => {
      const user = userLeaveRoom(socket.id);
      // Sent to everyone
      io.to(user.room).emit(
        "message",
        formatMessage(
          botName,
          `${user.username} has disconnected from the chat!`
        )
      );

      // Send updated users list and room info to the room a user has left
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

});

// The port at which express app can be accessed
const PORT = 3000 || process.ENV.PORT;

// Making the express app listen at the port
server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));