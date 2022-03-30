let wordList = require('../fei-words.js')

let state = {
  blankList: new Array(wordList.length),
  isLocked: false,
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

    socket.on('join', function (cb) {
      cb(state)
    })

    socket.on('send reset', () => {
      console.log('RESET ')

      state.blankList = new Array(wordList.length)
      state.isLocked = false

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
      console.log('WORD  ', socket.id, ': ', to, from)

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

      // tell everybody about the new selected word
      socket.emit('new state', state)
      socket.broadcast.emit('new state', state)
      return callback()
    })

    socket.on('disconnect', function (fn) {
      console.log('BYE!  ', socket.id)
    })
  })
}
