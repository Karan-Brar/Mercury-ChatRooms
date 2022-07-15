const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");

socket.on('message', (message) => {
    console.log(message.text);

    outputMessage(message.username, message.text, message.time);

    chatMessages.scrollTop = chatMessages.scrollHeight;
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

