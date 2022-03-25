<template>
  <main class="main">

    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" style="padding: 0.5rem; display: inline-block;">&lt;- Party Index</NuxtLink>

    <div id="poemcontainer" ref="poem">
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
    console.log('resetting')
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
