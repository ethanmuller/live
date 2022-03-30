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
      {{isLocked}}
      <div id="poem">
        <h1 id="title">
          填充題
        </h1>
        <p>長頭髮的<WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />住在<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡</p>
        <p>討厭<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡強壯的<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>笑起來像<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>忘記的時候像<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>有一天<WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />被<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />了</p>
        <p><WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />們不知道明天會有什麼<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p><WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />在<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />裡等待著<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />出現</p>
        <p>途中<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />死了<WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />次</p>
        <p class="spacer"></p>
        <p>幸好還有<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p><WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />帶著<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' />和<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>用時間和<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>尋回了<WordSelector length='4' :wordList='wordList' :blankList='blankList' :socket='socket' />的<WordSelector length='2' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>那天以後</p>
        <p>一切都<WordSelector length='4' :wordList='wordList' :blankList='blankList' :socket='socket' /></p>
        <p>可是永遠有人記得那個<WordSelector length='1' :wordList='wordList' :blankList='blankList' :socket='socket' />月</p>
        <p>非常非常地冷</p>
        <p class="spacer"></p>
      </div>
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
  }

  #poem {
    margin: 0 auto;
  }

  /*
  [data-length='1'] {
    width: 1.5rem;
  }
  [data-length='2'] {
    width: 3rem;
  }
  [data-length='4'] {
    width: 6rem;
  }
  */

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    .word-selector {
        margin: 0px -5px 0px -5px;
    }
  }

  @media (min-width: 600px)
  { /* big */
  
    #poemcontainer {
      font-size: 2rem;
    }

    #poem {
      width: min(90vw, 512px);
    }

    .spacer {
      height: 2rem;
    }
  }

  @media (max-width: 600px)
  { /* small */

    #poemcontainer {
      font-size: 1.4rem;
    }

    #poemcontainer h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }

    #poem {
      width: min(90vw, 310px);
    }

    .spacer {
      height: 1rem;
    }
  }
</style>
