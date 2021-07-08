const socket = io()

// elements
const messages = document.getElementById('messages')
const msgInput = document.getElementById('message-input')
const msgForm = document.getElementById('message-form')
const msgFormButton = document.getElementById('msg-form-button')
const onlineNow = document.getElementById('online-now')
const header = document.getElementById('header')

// parse nickname and room from querystring
const options = new URLSearchParams(location.search)
const nickname = options.get('nickname')
const room = options.get('room')

const addMessage = (message={}) => {
  const newDiv = document.createElement('div')
  const authorP = document.createElement('p')
  const contentP = document.createElement('p')
  const parsedTime = moment(new Date(message.createdAt)).format("LT")

  authorP.textContent = `${message.author} [${parsedTime}]`
  authorP.setAttribute('class', 'fs-5 fw-bolder author-nickname')
  contentP.textContent = message.content

  newDiv.appendChild(authorP)
  newDiv.appendChild(contentP)
  newDiv.setAttribute('class', 'msg')

  messages.appendChild(newDiv)
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

socket.on('room data', (data) => {
  onlineNow.innerHTML = ''
  header.textContent = data.room 

  data.users.forEach((user) => {
    const newUser = document.createElement('li')
    newUser.textContent = user.nickname
    newUser.setAttribute('class', 'list-group-item')
    onlineNow.append(newUser)
  })
})

socket.emit('join', { nickname, room }, (err, res) => {
  if(err) {
    alert("Failed to join room: " + err.error)
    location.replace('/')
  }
})