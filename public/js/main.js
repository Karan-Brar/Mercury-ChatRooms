const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// Getting username and roomname from the url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', {username, room})

socket.on('message', (message) => {
    console.log(message.text);

    outputMessage(message.username, message.text, message.time);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({room , users}) => {
    outputRoomName(room);
    outputUserList(users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(username,message, timestamp) {
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');

    newMessage.innerHTML = 
   `<p class="meta">${username} <span>${timestamp}</span></p>
	<p class="text">
        ${message}
	</p>`;

    chatMessages.appendChild(newMessage);
}

function outputRoomName(room) {
    roomName.innerText = `${room}`;
}

function outputUserList(users) {
    usersList.innerHTML = '';
    users.forEach((item) => {
        let userItem = document.createElement('li');
        userItem.innerText = item.username;
        usersList.appendChild(userItem);
    });
}

