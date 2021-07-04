const socket = io()

const messages = document.getElementById('messages')
const msgInput = document.getElementById('message-input')
const nicknameInput = document.getElementById('nickname-input')
const msgForm = document.getElementById('message-form')
const nicknameForm = document.getElementById('nickname-form')

const addMessage = (author='anonymous', content) => {
  const newMsg = document.createElement('p')
  newMsg.textContent = author + ': ' + content
  messages.appendChild(newMsg)
}

msgForm.addEventListener('submit', (event) => {
  event.preventDefault()
  if(msgInput.value) {
    socket.emit('message', msgInput.value)
    msgInput.value = ''
  }
})

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const { value } = nicknameInput
  console.log(value)
  if(value) {
    socket.emit('set nickname', value) 

    document.getElementById('current-nickname').textContent = `current nickname: ${value}`
  }
})

socket.on('message', ({ content, author }) => addMessage(author, content))