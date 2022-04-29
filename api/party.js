const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const partyManager = require('../server/party-manager')

app.use(bodyParser.json())
app.use(fileUpload())

app.get('/', (req, res) => {
  res.json(partyManager.partyList)
})

app.post('/', (req, res) => {
  const newPartyData = {
    ticket: req.body.ticket,
    selectedGame: req.body.selectedGame,
  }
  const party = partyManager.addParty(newPartyData)
  res.json(party)
})

app.get('/:id', (req, res) => {
  const party = partyManager.getParty(req.params.id.toLowerCase())

  if (!party) {
    return res.sendStatus(404);
  }

  res.json(party)
})

app.post('/:id/upload', (req, res) => {
  

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }

  const { party, socketId } = req.body
  const drawling = req.files.drawling

  const filename = `${party}-${socketId}.png`
  const filepath = `${__dirname}/../static/uploads`
  const url = `${req.headers.origin}/uploads/${filename}?when=${Date.now()}`

  drawling.mv(
    `${filepath}/${filename}`,
    function (err) {
      if (err) return res.status(500).send(err)
      res.json({ url })
    })

})

module.exports = app
