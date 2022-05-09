const partyManager = require('../server/party-manager')
let wordList = require('../fei-words.js')

let state = {
  game: 'YenTing',

  // FillingIn
  blankList: new Array(wordList.length),
  isLocked: false,

  // Raven
  ravenState: 'intro',
  votes: {
    Piano: 0,
    Guitar: 0,
    Bass: 0,
    Drums: 0,
  }
}

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data))
}

const originalWordList = deepCopy(wordList)

export let io = null;

export default function(socketInstance) {
  io = socketInstance

  socketInstance.on('connection', (socket) => {
    console.log('HELLO ', socket.id)

    function closeWordSelector() {
      let index = state.blankList.indexOf(socket.id)

      if (index === -1) {
        return
      }

      while (index !== -1) {
        state.blankList[index] = null
        index = state.blankList.indexOf(socket.id)
      }

      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    }

    socket.on('join', function (cb) {
      cb(state)
    })

    socket.on('send reset', () => {
      console.log('RESET ')

      state.blankList = new Array(wordList.length)
      state.isLocked = false

      state.ravenState = 'intro'
      state.votes = {
        Piano: 0,
        Guitar: 0,
        Bass: 0,
        Drums: 0,
      }

      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    })

    socket.on('end party', (id) => {
      console.log('END   ', id)
      partyManager.endParty(id)
      socket.emit('end party', state)
      socket.broadcast.emit('end party', state)
    })

    socket.on('open word selector', (i) => {
      if (state.blankList.indexOf(socket.id) > -1) {
        closeWordSelector()
      }

      state.blankList[i] = socket.id

      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    })

    socket.on('close word selector', closeWordSelector)

    socket.on('change game', (game) => {
      console.log('GAME  ', socket.id)
      state.game = game
      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    })

    socket.on('lock state', () => {
      console.log('LOCK  ', socket.id)
      state.isLocked = true
      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    })

    socket.on('unlock state', () => {
      console.log('UNLOCK ', socket.id)
      state.isLocked = false
      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
    })

    socket.on('submit word', function (to,from,indexOfBlank, callback) {
      console.log('WORD  ', socket.id, ': ', indexOfBlank, to, from)

      const word = to

      // make sure word is an actual word
      if (wordList.indexOf(word) == -1) {
        const err = { err: $`word ${word} does not exist in word list` }
        console.error(err)
        return callback(err)
      }

      // make sure word isn't already used
      if (state.blankList.indexOf(word) > -1) {
        const err = { err: 'word already in use' }
        console.error(err)
        return callback(err)
      }


      // mark word as used
      state.blankList[indexOfBlank] = word

      // free up word we changed from if it was used already
      const fromIndex = state.blankList.indexOf(from)
      if (fromIndex > -1) {
        state.blankList[fromIndex] = null
      }

      // tell everybody about the new selected word
      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
      return callback()
    })

    socket.on('end round', function () {
      state.ravenState = 'results'
      io.emit('new state', state)
    })

    socket.on('end game', function() {
      state.ravenState = 'end'
      io.emit('new state', state)
    })

    socket.on('start round', function () {
      state.votes = {
        Piano: 0,
        Guitar: 0,
        Bass: 0,
        Drums: 0,
      }

      state.ravenState = 'voting'

      io.emit('new state', state)
    })

    socket.on('send vote', function (instrument) {
      state.votes[instrument] += 1
      io.emit('new state', state)
    })

    socket.on('disconnect', function (fn) {
      closeWordSelector()
      console.log('BYE!  ', socket.id)
    })
  })
}
