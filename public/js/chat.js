const socket = io()

const messages = document.getElementById('messages')
const msgInput = document.getElementById('message-input')
const nicknameInput = document.getElementById('nickname-input')
const msgForm = document.getElementById('message-form')
const nicknameForm = document.getElementById('nickname-form')
const msgFormButton = document.getElementById('msg-form-button')
const nicknameFormButton = document.getElementById('nickname-form-button')

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

      console.log(res)
    })
  }
})

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const { value } = nicknameInput
  console.log(value)
  if(value) {
    nicknameFormButton.setAttribute('disabled', 'disabled')
    socket.emit('set nickname', value, (err, res) => {
      nicknameFormButton.removeAttribute('disabled')
      nicknameForm.blur()
      if(err)return console.error(err)

      console.log(res)
    }) 

    document.getElementById('current-nickname').textContent = `current nickname: ${value}`
  }
})

socket.on('message', (message) => addMessage(message))