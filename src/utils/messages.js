const createMessage = (author, content) => {
  return {
    author,
    content,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  createMessage
}