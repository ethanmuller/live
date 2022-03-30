let wordList = require('../fei-words.js')
let blankList = new Array(wordList.length)

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data))
}

const originalWordList = deepCopy(wordList)

export let io = null;

export default function(socketInstance) {
  io = socketInstance

  function reset() {
    console.log('RESET ')
    blankList = new Array(wordList.length)
    io.emit('reset state')
  }

  socketInstance.on('connection', (socket) => {
    console.log('HELLO ', socket.id)

    socket.on('join', function (cb) {
      cb(blankList)
    })

    socket.on('reset state', reset)

    socket.on('submit word', function (to,from,indexOfBlank, callback) {
      console.log('WORD  ', socket.id, ': ', to, from)

      const word = to

      // make sure word isn't already used
      if (blankList.indexOf(word) > -1) {
        const err = { err: 'word already in use' }
        console.error(err)
        return callback(err)
      }

      // make sure blank isn't already filled
      if (!!blankList[indexOfBlank]) {
        const err = { err: 'something is already in that blank' }
        console.error(err)
        return callback(err)
      }

      // mark word as used
      blankList[indexOfBlank] = word

      // free up word we changed from if it was used already
      const fromIndex = blankList.indexOf(from)
      if (fromIndex > -1) {
        blankList[fromIndex] = null
      }

      // tell everybody about the new selected word
      console.log(blankList)
      socket.emit('new state', blankList)
      socket.broadcast.emit('new state', blankList)
      return callback()
    })

    socket.on('disconnect', function (fn) {
      console.log('BYE!  ', socket.id)
    })
  })
}
