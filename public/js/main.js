const socket = io();
const chatForm = document.getElementById('chat-form');

socket.on('message', (message) => {
    console.log(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);
})

