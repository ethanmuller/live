require('dotenv').config({ quiet: true })

const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const eggsApi = require('./api/eggs')
const multiplayerManager = require('./multiplayer-manager')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.json())

app.use('/api', eggsApi)

multiplayerManager(io)

if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(__dirname, '..', 'dist')
  app.use(express.static(distDir))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8008 : 8009)

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`)
})
