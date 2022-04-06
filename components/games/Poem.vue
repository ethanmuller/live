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


        <p>
          <span>長頭髮的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose"  :isLocked="isLocked" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />住在<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡</span>
          <span>討厭<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡強壯的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span>笑起來像<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span>忘記的時候像<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" anchor="right" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
        </p>
        <p>
          <span>有一天<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />被<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />了</span>
          <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />們不知道明天會有什麼<WordSelector anchor="right" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />在<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡等待著<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />出現</span>
          <span>途中<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />死了<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />次</span>
        </p>
        <p>
          <span>幸好還有<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span><WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />帶著<WordSelector anchor="left" v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />和<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span>用時間和<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span>尋回了<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='4' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
        </p>
        <p>
          <span>那天以後</span>
          <span>一切都<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='4' :wordList='wordList' :blankList='blankList' :socket='socket' /></span>
          <span>可是永遠有人記得那個<WordSelector v-on:wordSelectorOpen="wordSelectorOpen" v-on:wordSelectorClose="wordSelectorClose" :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />月</span>
          <span>非常非常地冷</span>
        </p>

    </div>

    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" class="partylink">&lt;- Party Index</NuxtLink>
    
  </main>
</template>

<script>
import QRCode from 'qrcode'
import socket from '~/plugins/socket.io-client.js'
import wordList from '../../fei-words.js'


export default {
  data() {
    return {
      socket: socket,
      isMod: this.$route.query.role === 'mod',
      wordList,
      blankList: new Array(wordList.length),
      isLocked: false,
      url: '',

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
    })
  },

  beforeDestroy() {
  },

  methods: {
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
    connect() {
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
