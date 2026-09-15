require('dotenv').config({ quiet: true })

const path = require('path')
const fs = require('fs')
const http = require('http')
const express = require('express')
const fileUpload = require('express-fileupload')
const { Server } = require('socket.io')

const partyApi = require('./api/party')
const eggsApi = require('./api/eggs')
const multiplayerManager = require('./multiplayer-manager')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())
app.use(fileUpload())

app.use('/api/party', partyApi)
app.use('/api', eggsApi)

const uploadsDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

multiplayerManager(io)

if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(__dirname, '..', 'dist')
  app.use(express.static(distDir))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const host = process.env.HOST || '0.0.0.0'
// PORT always wins if set (the knob to use for Docker/deployment). Absent
// that, dev keeps the backend on 8009 so it doesn't collide with Vite on
// CLIENT_PORT (8008); production - one process, no Vite - defaults to 8008.
const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8008 : 8009)

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
