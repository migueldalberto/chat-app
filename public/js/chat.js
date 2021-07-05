const socket = io()

// elements
const messages = document.getElementById('messages')
const msgInput = document.getElementById('message-input')
const msgForm = document.getElementById('message-form')
const msgFormButton = document.getElementById('msg-form-button')

// parse nickname and room from querystring
const [ nickname, room ] = location.search
  .slice(1)
  .split('&')
  .map((i) => {
    return decodeURI(i.split('=')[1])
  })

const addMessage = (message={}) => {
  const newMsg = document.createElement('p')
  const time = new Date(message.createdAt)
  const parsedTime = `${time.getHours()}:${time.getMinutes()}`
  newMsg.textContent = `${message.author} [${parsedTime}]: ${message.content}`
  messages.appendChild(newMsg)
  messages.scrollTo(0, messages.scrollHeight)
}

msgForm.addEventListener('submit', (event) => {
  event.preventDefault()
  if(msgInput.value) {
    msgFormButton.setAttribute('disabled', 'disabled')

    socket.emit('message', msgInput.value, (err, res) => {
      msgFormButton.removeAttribute('disabled')
      msgInput.value = ''
      msgInput.focus()

      if(err)return console.error(err)
    })
  }
})

socket.on('message', (message) => addMessage(message))

socket.emit('join', { nickname, room }, (err, res) => {
  if(err) {
    alert("Failed to join room: " + err)
    location.replace('/')
  }
})