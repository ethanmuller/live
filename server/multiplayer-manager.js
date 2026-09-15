const wordList = require('./fei-words.js')

// One game state per party, instead of one global state shared by everybody.
const partyStates = new Map()

function getState(partyId) {
  if (!partyStates.has(partyId)) {
    partyStates.set(partyId, {
      blankList: new Array(wordList.length),
      isLocked: false,
    })
  }
  return partyStates.get(partyId)
}

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('HELLO ', socket.id)

    function closeWordSelector() {
      const partyId = socket.data.partyId
      if (!partyId) {
        return
      }

      const state = getState(partyId)
      let index = state.blankList.indexOf(socket.id)

      if (index === -1) {
        return
      }

      while (index !== -1) {
        state.blankList[index] = null
        index = state.blankList.indexOf(socket.id)
      }

      io.to(partyId).emit('new state', state)
    }

    socket.on('join', function (partyId, cb) {
      if (socket.data.partyId && socket.data.partyId !== partyId) {
        socket.leave(socket.data.partyId)
      }

      socket.data.partyId = partyId
      socket.join(partyId)

      cb(getState(partyId))
    })

    socket.on('send reset', () => {
      const partyId = socket.data.partyId
      if (!partyId) {
        return
      }

      console.log('RESET ')

      const state = getState(partyId)
      state.blankList = new Array(wordList.length)
      state.isLocked = false

      io.to(partyId).emit('new state', state)
    })

    socket.on('open word selector', (i) => {
      const partyId = socket.data.partyId
      if (!partyId) {
        return
      }

      const state = getState(partyId)

      if (state.blankList.indexOf(socket.id) > -1) {
        closeWordSelector()
      }

      state.blankList[i] = socket.id

      io.to(partyId).emit('new state', state)
    })

    socket.on('close word selector', closeWordSelector)

    socket.on('lock state', () => {
      const partyId = socket.data.partyId
      if (!partyId) {
        return
      }

      console.log('LOCK  ', socket.id)
      const state = getState(partyId)
      state.isLocked = true
      io.to(partyId).emit('new state', state)
    })

    socket.on('unlock state', () => {
      const partyId = socket.data.partyId
      if (!partyId) {
        return
      }

      console.log('UNLOCK ', socket.id)
      const state = getState(partyId)
      state.isLocked = false
      io.to(partyId).emit('new state', state)
    })

    socket.on('submit word', function (to, from, indexOfBlank, callback) {
      const partyId = socket.data.partyId
      if (!partyId) {
        return callback({ err: 'not in a party' })
      }

      console.log('WORD  ', socket.id, ': ', to, from)

      const state = getState(partyId)
      const word = to

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

      // tell everybody in this party about the new selected word
      io.to(partyId).emit('new state', state)
      return callback()
    })

    socket.on('disconnect', function () {
      closeWordSelector()
      console.log('BYE!  ', socket.id)
    })
  })
}
