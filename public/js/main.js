

const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");
const leaveBtn = document.getElementById("leave-room");

const baseURL = "https://mercury-chatrooms.onrender.com/";

const urlParams = new URLSearchParams(window.location.search);

const userId = urlParams.get("id");

socket.emit('joinRoom', {userId})

socket.on('message', (message) => {
    outputMessage(message.username, message.text, message.time);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room.Roomname);
    outputUserList(users);
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    let msgAndSender = { msg: msg, sender: userId };

    console.log(msgAndSender)

    socket.emit('chatMessage', msgAndSender);

    

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

leaveBtn.addEventListener('click', (e) => {
     window.location = baseURL;
})

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
        userItem.innerText = item.Username;
        usersList.appendChild(userItem);
    });
}

