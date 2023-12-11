// Importing Express, path, http, socket.io and utlity modules
const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getUser,
  getRoomUsers,
  userLeaveRoom,
} = require("./utils/users");
const { sequelize, User, Message, Room } = require("./database");
const bodyParser = require("body-parser");
const { send } = require("process");

// Initializing an express application, http server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting up middleware that allows express app to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const socketToUserIdMap = {};

app.get("/getRooms", async (req, res) => {
  console.log("get rooms hit");
  const rooms = await Room.findAll();
  const roomNames = rooms.map((room) => room.Roomname);
  res.json(roomNames);
  console.log(roomNames);
});

app.post("/createUser", async (req, res) => {
  const userData = req.body;
  const room = await Room.findOne({ where: { Roomname: userData.room } });
  console.log("Room in data: " + userData.room);
  console.log(room);
  const roomId = room.getDataValue("ID");
  console.log("Before Await!");
  const existingUsers = await User.findAll({
    where: { Username: userData.username },
    include: Room,
  });
  console.log("After Await!");
  const existingRoomUser = existingUsers.filter(
    (user) => user.Room.ID === roomId
  )[0];
  console.log(existingRoomUser);

  if (existingRoomUser !== undefined) {
    res.json({ userExists: true, user: null });
  } else {
    let createdUser = await User.create({
      Username: userData.username,
      RoomID: roomId,
    });
    
    res.json({ userExists: false, user: createdUser });
  }
});

// This is only for populating the database through using this endpoint from postman
// app.post("/createRoom", async(req, res) => {
//   let roomName = req.body.roomname;
//   const room = await Room.create({ Roomname: roomName });
//   res.json( room );
// });

const botName = "MercuryBot";

// Run a callback function when a client connects
io.on("connection", (socket) => {
  const user = null;
  socket.on("joinRoom", async ({ userId }) => {

    socketToUserIdMap[socket.id] = userId;
    console.log("Beautifuly boy " + socketToUserIdMap[socket.id]);
    console.log(userId);
    const user = await User.findOne({
      where: { ID: userId },
      include: Room,
    });

    console.log(user);
    // enabling room functionality
    socket.join(user.Room.Roomname);

    // Sent to the client
    socket.emit("message", formatMessage(botName, "Welcome to Mercury!"));

    // Sent to everyone but the client
    socket.broadcast
      .to(user.Room.Roomname)
      .emit(
        "message",
        formatMessage(botName, `${user.Username} has joined the chat!`)
      );

    let roomUsers = await User.findAll({
      where: { RoomID: user.Room.ID },
    });

    // Send updated users list and room info to the room a user has joined
    io.to(user.Room.Roomname).emit("roomUsers", {
      room: user.Room,
      users: roomUsers,
    });
  });

  socket.on("chatMessage", async (msgAndSender) => {
    const currentUser = await User.findOne({
      where: { ID: msgAndSender.sender },
      include: Room,
    });
    io.to(currentUser.Room.Roomname).emit(
      "message",
      formatMessage(currentUser.Username, msgAndSender.msg)
    );
  });



  socket.on("disconnect", async () => {
    const userId = socketToUserIdMap[socket.id];

      const user = await User.findOne({
        where: { ID: userId },
        include: Room,
      });

    // Sent to everyone
    io.to(user.Room.Roomname).emit(
      "message",
      formatMessage(botName, `${user.Username} has disconnected from the chat!`)
    );

    await user.destroy();

    let updatedRoomUsers = await User.findAll({
      where: { RoomID: user.Room.ID },
    });

    // Send updated users list and room info to the room a user has left
    io.to(user.Room.Roomname).emit("roomUsers", {
      room: user.Room,
      users: updatedRoomUsers,
    });
  });
});

// The port at which express app can be accessed
const PORT = 3000 || process.ENV.PORT;

// Making the express app listen at the port
server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
