// note we are importing the default state of data from this file
// but it is mutated over the program's lifetime
//let wordList = require('../mad-lib.js')
let wordList = require('../fei-words.js')

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data))
}

const originalWordList = deepCopy(wordList)

export let io = null;

export default function(socketInstance) {
  io = socketInstance

  function reset() {
    wordList = deepCopy(originalWordList)
    io.emit('reset', wordList)
  }

  socketInstance.on('connection', (socket) => {
    console.log('HELLO ', socket.id)

    socket.on('join', function (cb) {
      cb(wordList)
    })

    socket.on('reset', reset)

    socket.on('update', function (to,from,indexOfBlank, callback) {
     console.log('WORD  ', socket.id, ': ', to, from)

      Object.keys(wordList).forEach((g) => Object.keys(wordList[g]).forEach(w => {
        if (w === to) {

          if (wordList[g][w] !== -1) {
            return callback({ err: 'word already in use' })
          }

          // mark word as used
          wordList[g][w] = indexOfBlank

          // free up word

          // tell everybody about the new selected word
          socket.broadcast.emit('update', to, from, indexOfBlank, wordList, socket.id)

          // we don't use this callback to send data,
          // just so they can stop waiting to hear back
          // in case of an error
          return callback()
        }
      }))
    })

    socket.on('disconnect', function (fn) {
      console.log('BYE!  ', socket.id)
    })
  })
}
