const path = require('path')
const express = require('express')

const app = express()
// serving public directory
app.use(express.static(path.join(__dirname, '../public')))

// listenning to port
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('server is on: ' + port)
})