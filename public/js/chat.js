const socket = io()

const messages = document.getElementById('messages')
const input = document.getElementById('message-input')
const submitButton = document.getElementById('submit-button')

const addMessage = (text, user='anonymous') => {
  const newMsg = document.createElement('p')
  newMsg.textContent = user + ': ' + text
  messages.appendChild(newMsg)
}

submitButton.addEventListener('click', (event) => {
  if(input.value) {
    socket.emit('chat message', input.value)
    input.value = ''
  }
})

socket.on('chat message', (msg) => {
  addMessage(msg)
})

socket.on('user joined', (socket) => {
  addMessage(`${socket.nickname || 'user'} joined`, 'CHAT')
})

socket.on('user left', (socket) => {
  addMessage(`${socket.nickname || 'user'} left`, 'CHAT')
})