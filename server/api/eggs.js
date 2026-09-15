const express = require('express')

const app = express.Router()

app.get('/eggs', (req, res) => {
  res.json([
    'bird',
    'lizard',
    'human',
    'fish',
  ])
})

module.exports = app
