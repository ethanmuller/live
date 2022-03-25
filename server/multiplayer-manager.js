import wordList from '../mad-lib.js'

export let io = null;

export default function(socketInstance) {
  io = socketInstance

  socketInstance.on('connection', (socket) => {

    socket.on('add-word', function (word,indexOfBlank) {
     console.log('server received add-word', word, 'from socket', socket.id)
      Object.keys(wordList).forEach((g) => Object.keys(wordList[g]).forEach(w => {
        if (w === word) {
          wordList[g][w] = indexOfBlank
          socket.emit('add-word', word, indexOfBlank, wordList, socket.id)
          console.log('emitted new data')
        }
      }))
    })

    socket.on('disconnect', function (fn) {
    })
  })
}
