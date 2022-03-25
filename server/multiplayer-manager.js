// note we are importing the default state of data from this file
// but it is mutated over the program's lifetime
import wordList from '../mad-lib.js'

const defaultWordList = Object.assign({}, wordList)

export let io = null;

export default function(socketInstance) {
  io = socketInstance

  socketInstance.on('connection', (socket) => {
    console.log('HELLO ', socket.id)

    socket.on('join', function (cb) {
      cb(wordList)
    })

    socket.on('update', function (word,indexOfBlank) {
     console.log('server received update', word, 'from socket', socket.id)
      Object.keys(wordList).forEach((g) => Object.keys(wordList[g]).forEach(w => {
        if (w === word) {
          wordList[g][w] = indexOfBlank
          socket.broadcast.emit('update', word, indexOfBlank, wordList, socket.id)
          console.log(wordList)
        }
      }))
    })

    socket.on('disconnect', function (fn) {
      console.log('BYE!  ', socket.id)
    })
  })
}
