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
        <h1 id="title">
          填充題
        </h1>
        <p>長頭髮的<WordSelector :isLocked="isLocked" length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />住在<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡</p>
        <p>討厭<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡強壯的<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>笑起來像<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>忘記的時候像<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector :isLocked="isLocked" length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>有一天<WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />被<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />了</p>
        <p><WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />們不知道明天會有什麼<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p><WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />在<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡等待著<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />出現</p>
        <p>途中<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />死了<WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />次</p>
        <p class="spacer"></p>
        <p>幸好還有<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p><WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />帶著<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />和<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>用時間和<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>尋回了<WordSelector :isLocked="isLocked"length='4' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector :isLocked="isLocked"length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>那天以後</p>
        <p>一切都<WordSelector :isLocked="isLocked"length='4' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>可是永遠有人記得那個<WordSelector :isLocked="isLocked"length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />月</p>
        <p>非常非常地冷</p>
        <p class="spacer"></p>
    </div>

    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" class="partylink">&lt;- Party Index</NuxtLink>
    
  </main>
</template>

<script>
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
    }
  },

  watch: {
    'blankList': function(blankList) {
      // whenever blankList changes,
      // we programatically update each WordSelector component
      // to reflect the newly received list of what words are in which slots

      const wordSelectorComponents = this.$children.filter(c => c._name === '<WordSelector>')

      wordSelectorComponents.forEach((wordSelector,index) => {
        if (!!blankList[index]) {
          wordSelector.setWord(blankList[index])
        } else {
          wordSelector.setWord('')
        }
      })
    }
  },

  mounted() {
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
    console.log('got new state: ', newState)
      this.blankList = newState.blankList
      this.isLocked = newState.isLocked
    }
  },
}
</script>

<style>
  p {
    margin: 0 0;
  }
  .partylink {
    padding: 0.5rem; display: inline-block;
  }

  #poemcontainer {
    width: 100%;
    font-family: 'Noto Sans TC', sans-serif;
    max-width: 18em;
    line-height: 1.7;

    font-size: 1.2rem;
    padding: 0.5em;
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
