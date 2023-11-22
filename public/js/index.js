let roomsList = document.getElementById('room');
const submitBtn = document.getElementById("submitBtn");

const baseURL = "https://mercury-chatrooms.onrender.com/";

document.addEventListener(
  "load",
  fetch(baseURL + "getRooms")
    .then((response) => response.json())
    .then((data) => fillRoomOptions(data))
);

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let room = document.getElementById("room").value;

  const data = {username, room};
  fetch(baseURL + "createUser", {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    if(data.userExists)
    {
      console.log("User Already exists");
    }
    else
    {
      window.location = baseURL + "chat.html";
    }
  })
  .catch((error) => {
    console.error("Error:", error)
  })
})

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
