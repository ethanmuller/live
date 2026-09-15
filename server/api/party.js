const express = require('express')
const partyManager = require('../party-manager')

const app = express.Router()

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
    return res.sendStatus(404)
  }

  res.json(party)
})

module.exports = app
