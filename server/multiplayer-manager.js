import partyManager from './party-manager'
import wordList from '../mad-lib.js'

export let io = null;

export default function(socketInstance) {
  // This line feels incredibly flaky,
  // but I don't know how else to export
  // the socketInstance that is passed to this
  // function.
  io = socketInstance

  socketInstance.on('connection', (socket) => {

    socket.on('add-word', function (word,indexOfBlank) {
      console.log(word, indexOfBlank)
      
      // cycle through groups
      // look for match
      // set key's value to index of blank. this word goes into Nth blank
      Object.keys(wordList).forEach((g) => Object.keys(wordList[g]).forEach(w => {
        if (w === word) {
          wordList[g][w] = indexOfBlank
          console.log(wordList)

          socket.broadcast.emit('add-word', wordList, indexOfBlank)
        }
      }))
    })

    socket.on('disconnect', function (fn) {
      console.log(`disconnect: ${socket}`)
    })
  })
}
