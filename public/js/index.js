let roomsList = document.getElementById('room');

document.addEventListener(
  "load",
  fetch("http://localhost:3000/getRooms")
    .then((response) => response.json())
    .then((data) => fillRoomOptions(data))
);

function fillRoomOptions(rooms){
  console.log(rooms);
  roomsList.innerHTML = '';
  rooms.forEach(room => {
    let option = document.createElement('option');
    option.value = room;
    option.innerText = room;
    roomsList.appendChild(option);
  });
}
