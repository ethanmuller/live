<template>
  <main class="main">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="mod-panel__controls">
        <button v-if="!isLocked" @click="sendLock()" class="btn btn--mod">🔒 Lock</button>
        <button v-if="isLocked" @click="sendUnlock()" class="btn btn--mod">🔓 Unlock</button>
        <button @click="offerReset()" class="btn btn--mod">🔄 Reset</button>
      </div>
      <div class="controls">
        <select @change="changeGame" v-model="game">
          <option disabled value="">Please select one</option>
          <option>FillingIn</option>
          <option>Static</option>
        </select>
      </div>
    </div>

    <canvas ref="canvas" class="qrcode"></canvas>

    <component :is="game" />

  </main>
</template>

<script>
import QRCode from 'qrcode'
import socket from '~/plugins/socket.io-client.js'
import wordList from '../fei-words.js'


export default {
  data() {
    return {
      socket: socket,
      isMod: this.$route.query.role === 'mod',
      wordList,
      blankList: new Array(wordList.length),
      isLocked: false,
      url: '',

      game: '',

      // Only one WordSelector is allowed open at a time.
      // This represents the index of the one that's open.
      //openWordSelectorIndex: -1,
    }
  },

  watch: {
    'blankList': function(blankList) {
      // whenever blankList changes,
      // we programatically update each WordSelector component
      // to reflect the newly received list of what words are in which slots

      const wordSelectorComponents = this.$children.filter(c => c._name === '<WordSelector>')

      wordSelectorComponents.forEach((wordSelector,index) => {
        if (!!blankList[index] && blankList[index].length !== 20) {
          wordSelector.setWord(blankList[index])
        } else {
          wordSelector.setWord('')
        }
      })
    }
  },

  mounted() {
    this.url = window.location.protocol + '//' + window.location.host + window.location.pathname
    const canvas = this.$refs.canvas


    QRCode.toCanvas(canvas, this.url, {
      scale: 8,
      margin: 0,
      color: {
        dark: '#000',  // Blue dots
        light: '#0000' // Transparent background
      }
    }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })

    this.socket.on('connect', this.connect)
    this.socket.on('new state', this.setState)
    this.socket.emit('join', (state) => {
      this.blankList = state.blankList
      this.isLocked = state.isLocked
      this.game = state.game
    })
  },

  beforeDestroy() {
  },

  methods: {
  changeGame() {
      this.socket.emit('change game', this.game)
  },
    connect() {
      console.log('connected')
    },
    wordSelectorOpen(i) {
    },
    wordSelectorClose() {
      this.openWordSelectorIndex = -1
    },
    findIndexOfInstance(self) {
      // this is a dodgy function, but it's what we use
      // to figure out the index this word lives at
      return self.$parent.$children
        .filter(c => c._name === '<WordSelector>') // Filter out other component types
        .indexOf(this)
    },
    offerReset() {
      if (confirm('Are you sure you want to reset everything?')) {
        this.sendReset()
      }
    },
    sendReset() {
      this.socket.emit('send reset')
    },
    sendLock() {
      this.socket.emit('lock state')
    },
    sendUnlock() {
      this.socket.emit('unlock state')
    },
    reset() {
      this.blankList = new Array(wordList.length)
      const wordSelectorComponents = this.$children.filter(c => c._name === '<WordSelector>');

      wordSelectorComponents.forEach((wordSelector,index) => {
        wordSelector.setWord('')
      })
    },

    setState(newState) {
      this.blankList = newState.blankList
      this.isLocked = newState.isLocked
      this.game = newState.game
    }
  },
}
</script>

<style>
  .qrcode {
    /* using sticky instead of absolute
    so it doesn't cover mod bar */
    position: sticky;
    top: 0;

align-self: flex-end;

    width: 3.7em !important;
    height: auto !important;
    padding: 0.5em;
    background: white;
    z-index: 1;
  }

  .qrcode {
    font-size: 1.2rem;
  }
  @media (min-width: calc(336px)) {
    .qrcode {
      /* this font size will grow with the browser */
      font-size: calc(0.2rem + 5vw);
    }
  }
  @media (min-width: calc(590px)) {
    .qrcode {
      /* cap off font size growth */
      font-size: 2rem;
    }
  }
</style>
