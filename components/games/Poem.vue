<template>
  <main class="main">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="mod-panel__controls">
        <div class="host-note">
          <button @click="sendReset()" class="btn btn--mod">Reset Poem</button>
        </div>
        <!--<div class="host-note"><button @click="endPartyButton()" class="btn btn--mod">End Party</button></div>-->
      </div>
    </div>
    
    <div id="poemcontainer">
      <div id="poem">
        <h1 id="title">
          填充題
        </h1>
        <p>長頭髮的<WordSelector type='one' :wordList='wordList' :socket='socket' />住在<WordSelector type='two' :wordList='wordList' :socket='socket' />裡</p>
        <p>討厭<WordSelector type='two' :wordList='wordList' :socket='socket' />裡強壯的<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p>笑起來像<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p>忘記的時候像<WordSelector type='two' :wordList='wordList' :socket='socket' />的<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>有一天<WordSelector type='one' :wordList='wordList' :socket='socket' />被<WordSelector type='two' :wordList='wordList' :socket='socket' />了</p>
        <p><WordSelector type='one' :wordList='wordList' :socket='socket' />們不知道明天會有什麼<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p><WordSelector type='one' :wordList='wordList' :socket='socket' />在<WordSelector type='two' :wordList='wordList' :socket='socket' />裡等待著<WordSelector type='two' :wordList='wordList' :socket='socket' />出現</p>
        <p>途中<WordSelector type='two' :wordList='wordList' :socket='socket' />死了<WordSelector type='one' :wordList='wordList' :socket='socket' />次</p>
        <p class="spacer"></p>
        <p>幸好還有<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p><WordSelector type='one' :wordList='wordList' :socket='socket' />帶著<WordSelector type='two' :wordList='wordList' :socket='socket' />和<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p>用時間和<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p>尋回了<WordSelector type='four' :wordList='wordList' :socket='socket' />的<WordSelector type='two' :wordList='wordList' :socket='socket' /></p>
        <p class="spacer"></p>
        <p>那天以後</p>
        <p>一切都<WordSelector type='four' :wordList='wordList' :socket='socket' /></p>
        <p>可是永遠有人記得那個<WordSelector type='one' :wordList='wordList' :socket='socket' />月</p>
        <p>非常非常地冷</p>
        <p class="spacer"></p>
      </div>
      <div v-if="false">
        <p>The
          <WordSelector type='adjective' :wordList='wordList' :socket='socket' />
          <WordSelector type='noun' :wordList='wordList' :socket='socket' />
          <WordSelector type='verbed' :wordList='wordList' :socket='socket' />
          the
          <WordSelector type='adjective' :wordList='wordList' :socket='socket' />
          <WordSelector type='noun' :wordList='wordList' :socket='socket' />
        <p>But this caused the
          <WordSelector type='noun' :wordList='wordList' :socket='socket' />
          to
          <WordSelector type='verb' :wordList='wordList' :socket='socket' />
          <WordSelector type='adverbly' :wordList='wordList' :socket='socket' /></p>
      </div>
    </div>

    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" class="partylink">&lt;- Party Index</NuxtLink>
    
  </main>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
//import wordList from '../../mad-lib.js'
import wordList from '../../fei-words.js'

export default {
  data() {
    return {
      socket: socket,
      isMod: this.$route.query.role === 'mod',
      wordList,
    }
  },
  
    mounted() {
      this.socket.on('connect', this.connect)
      this.socket.on('update', this.addWord)
      this.socket.on('reset', this.reset)
      this.socket.emit('join', (serverWordList) => {
          this.wordList = serverWordList
          const blanks = this.$children.filter(c => c._name === '<WordSelector>')

          blanks.forEach((b,index) => {
              Object.keys(this.wordList).forEach((g) => Object.keys(this.wordList[g]).forEach((w) => {
                    const i = this.wordList[g][w]
                    if (i === index) {
                      b.setWord(w)
                    }
              }))
          })
      })
    },

  beforeDestroy() {
  },

  methods: {
    sendReset() {
      this.socket.emit('reset')
    },
    reset(wordList) {
      this.wordList = wordList;
      const blanks = this.$children.filter(c => c._name === '<WordSelector>');

      blanks.forEach((b,index) => {
        Object.keys(this.wordList).forEach((g) => Object.keys(this.wordList[g]).forEach((w) => {
          const i = this.wordList[g][w]
          if (i === -1) {
            b.setWord('')
          } else if (i === index) {
            b.setWord(w)
          }
          }))
      })
    },
    connect() {
    },
    addWord(to, from, i, wordList) {
      this.wordList = wordList
      const blanks = this.$children.filter(c => c._name === '<WordSelector>')
      blanks[i].setWord(to)
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
  font-size: 36px;
}

#poem {
  width: 600px;
  margin: 0 auto;
}
#poemcontainer p {
  
}

.spacer {
  height: 2rem;
}
</style>
