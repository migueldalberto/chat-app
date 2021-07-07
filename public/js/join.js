const socket = io()

const datalist = document.getElementById('active-rooms')

socket.on('active rooms', (activeRooms = []) => {
  activeRooms.forEach(room => {
    const newOption = document.createElement('option')
    newOption.setAttribute('value', room.name)

    datalist.appendChild(newOption)
  })
})