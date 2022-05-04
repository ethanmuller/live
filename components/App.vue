<template>
  <main class="main">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <div class="mod-panel" v-if="isMod">

      <div class="controls">
        <select @change="changeGame" v-model="game">
          <option disabled value="">Please select one</option>
          <option>Static</option>
          <option>FillingIn</option>
          <option>Raven</option>
        </select>
      </div>
      <div class="mod-panel__controls">

        <button v-if="!isLocked && game === 'FillingIn'" @click="sendLock()" class="btn btn--mod">🔒 Lock</button>
        <button v-if="isLocked && game === 'FillingIn'" @click="sendUnlock()" class="btn btn--mod">🔓 Unlock</button>

        <!-- Raven buttons -->
        <button v-if="ravenState === 'voting' && game === 'Raven'" @click="endRound" class="btn btn--mod">End Round</button>
        <button v-if="(ravenState === 'results' || ravenState === 'intro') && game === 'Raven'" @click="startRound" class="btn btn--mod">Start Round</button>
        <button v-if="ravenState === 'end' && game === 'Raven'" @click="offerReset()" class="btn btn--mod">Back to intro</button>
        <button v-if="ravenState === 'results' && game === 'Raven'" @click="endRaven" class="btn btn--mod">End song</button>

        <button v-if="game !== 'Raven'" @click="offerReset()" class="btn btn--mod">🔄 Reset</button>
        <button v-if="game === 'Static'" @click="endPartyConfirm()" class="btn btn--mod btn--danger">🛑 End Party: {{ this.$route.params.party }}</button>
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
      ravenState: 'intro'

      // Only one WordSelector is allowed open at a time.
      // This represents the index of the one that's open.
      //openWordSelectorIndex: -1,
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
    this.socket.on('end party', this.receivePartyEnd)
    this.socket.emit('join', (state) => {
      this.blankList = state.blankList
      this.isLocked = state.isLocked
      this.game = state.game
    })
  },

  beforeDestroy() {
    this.socket.off('connect', this.connect)
    this.socket.off('new state', this.setState)
    this.socket.off('end party', this.receivePartyEnd)
  },

  methods: {
  endRound() {
    this.socket.emit('end round')
  },
  startRound() {
    this.socket.emit('start round')
  },
  endRaven() {
    this.socket.emit('end game')
  },
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

    receivePartyEnd() {
      this.$router.push({ path: '/', query: this.$route.query })
    },

    endParty() {
      this.socket.emit('end party', this.$route.params.party )
    },

    endPartyConfirm() {
      if (confirm('Are you sure you want to end the party?')) {
        this.endParty()
      }
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
      this.ravenState = newState.ravenState
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
    height: 3.7em !important;
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
