<template>
  <main class="main">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="mod-panel__controls">
        <button v-if="!isLocked" @click="sendLock()" class="btn btn--mod">🔒 Lock Poem</button>
        <button v-if="isLocked" @click="sendUnlock()" class="btn btn--mod">🔓 Unlock Poem</button>
        <button @click="offerReset()" class="btn btn--mod">🔄 Reset Poem</button>
      </div>
    </div>

    <div id="poemcontainer">
	<canvas ref="canvas"></canvas>

        <h1 id="title">
          填充題
        </h1>


        <div>
          <p>
            <span>長頭髮的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose"  :isLocked="isLocked" :index="0" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />住在<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="1" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡</span>
            <span>討厭<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="2" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡強壯的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="3" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span>笑起來像<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="4" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span>忘記的時候像<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="5" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" anchor="right" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="6" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          </p>
          <p>
            <span>有一天<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="7" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />被<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="8" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />了</span>
            <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="9" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />們不知道明天會有什麼<WordSelector anchor="right" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="10" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="11" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />在<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="12" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡等待著<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="13" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />出現</span>
            <span>途中<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="14" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />死了<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="15" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />次</span>
          </p>
          <p>
            <span>幸好還有<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="16" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="17" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />帶著<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="18" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />和<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="19" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span>用時間和<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="20" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span>尋回了<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="21" length='4' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="22" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          </p>
          <p>
            <span>那天以後</span>
            <span>一切都<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="23" length='4' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
            <span>可是永遠有人記得那個<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" :index="24" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />月</span>
            <span>非常非常地冷</span>
          </p>
        </div>

    </div>

    <router-link :to="{ path: '/', query: this.$route.query }" v-if="isMod" class="partylink">&lt;- Party Index</router-link>

  </main>
</template>

<script>
import QRCode from 'qrcode'
import socket from '@/socket.js'
import wordList from '@/fei-words.js'
import WordSelector from '../WordSelector.vue'


export default {
  components: { WordSelector },
  data() {
    return {
      socket: socket,
      isMod: this.$route.query.role === 'mod',
      wordList,
      blankList: new Array(wordList.length),
      isLocked: false,
      url: '',
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

    // (re-)join the party's room every time we connect, since a dropped
    // and reconnected socket (e.g. a phone backgrounding the tab) gets a
    // new connection and isn't in any room until it joins again
    this.socket.on('connect', this.joinParty)
    this.socket.on('new state', this.setState)
    if (this.socket.connected) {
      this.joinParty()
    }
  },

  beforeDestroy() {
    this.socket.off('connect', this.joinParty)
    this.socket.off('new state', this.setState)
  },

  methods: {
    joinParty() {
      this.socket.emit('join', this.$route.params.party, (state) => {
        this.blankList = state.blankList
        this.isLocked = state.isLocked
      })
    },
    wordSelectorOpen(i) {
    },
    wordSelectorClose() {
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

    setState(newState) {
      this.blankList = newState.blankList
      this.isLocked = newState.isLocked
    }
  },
}
</script>

<style>
  canvas {
    /* using sticky instead of absolute
    so it doesn't cover mod bar */
    position: sticky;
    top: 0;
    right: 0;
    float: right;

    margin-top: -0.5em;
    margin-right: -0.5em;

    width: 3.7em !important;
    height: auto !important;
    padding: 0.5em;
    background: white;
  }
  p {
    margin: 0 0 2rem;
  }
  p > span {
    display: block;
  }
  .partylink {
    padding: 0.5rem; display: inline-block;
  }

  #poemcontainer {
    width: 100%;
    font-family: 'Noto Sans TC', sans-serif;
    max-width: 18em;
    line-height: 1.3;

    font-size: 1.2rem;
    padding: 0.5em 0.5em 9em;
  }
  @media (min-width: calc(336px)) {
    #poemcontainer {
      /* this font size will grow with the browser */
      font-size: calc(0.2rem + 5vw);
    }
  }
  @media (min-width: calc(590px)) {
    #poemcontainer {
      /* cap off font size growth */
      font-size: 2rem;
    }
  }
</style>
