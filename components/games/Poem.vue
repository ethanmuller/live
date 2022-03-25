<template>
  <main class="main">

    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" style="padding: 0.5rem; display: inline-block;">&lt;- Party Index</NuxtLink>


    <div id="poemcontainer">
    <div v-if="false">
      <p>長頭髮的＿住在＿＿裡</p>
      <p>討厭＿＿裡強壯的＿＿</p>
      <p>笑起來像＿＿</p>
      <p>忘記的時候像＿＿的＿＿</p>
      <p></p>
      <p>有一天＿被＿＿了</p>
      <p>＿們不知道明天會有什麼＿＿</p>
      <p>＿在＿＿裡等待著＿＿出現</p>
      <p>途中＿＿死了＿次</p>
      <p></p>
      <p>幸好還有＿＿</p>
      <p>＿帶著＿＿和＿＿</p>
      <p>用時間和＿＿</p>
      <p>尋回了＿＿＿＿的＿＿</p>
      <p></p>
      <p>那天以後</p>
      <p>一切都＿＿＿＿</p>
      <p>可是永遠有人記得那個＿月</p>
      <p>非常非常地冷</p>
      <p></p>
    </div>
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

    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="mod-panel__controls">
        <div class="host-note"><button @click="sendReset()" class="btn btn--mod">Reset Poem</button></div>
        <!--<div class="host-note"><button @click="endPartyButton()" class="btn btn--mod">End Party</button></div>-->
      </div>
    </div>
  </main>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
import wordList from '../../mad-lib.js'

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
    addWord(word, i, wordList) {
      this.wordList = wordList
      const blanks = this.$children.filter(c => c._name === '<WordSelector>')
      blanks[i].setWord(word)
    }
  },
}
</script>

<style>
p {
  margin: 3rem 0;
}
</style>
