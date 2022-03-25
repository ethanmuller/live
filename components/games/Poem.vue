<template>
  <main class="main">

connected: {{isConnected}}
    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" style="padding: 0.5rem; display: inline-block;">&lt;- Party Index</NuxtLink>

    <div id="poemcontainer" ref="poem">
      <p>The
        <WordSelector type='adjective' :wordList='wordList' :socket='socket' />
        <WordSelector type='noun' :wordList='wordList' :socket='socket' />
        <WordSelector type='verbed' :wordList='wordList' :socket='socket' />
        the
        <WordSelector type='adjective' :wordList='wordList' :socket='socket' />
        <WordSelector type='noun' :wordList='wordList' :socket='socket' /></p>
      <p>But this caused the
        <WordSelector type='noun' :wordList='wordList' :socket='socket' />
        to
        <WordSelector type='verb' :wordList='wordList' :socket='socket' />
        <WordSelector type='adverbly' :wordList='wordList' :socket='socket' /></p>
    </div>

    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="host-note"><button @click="endPartyButton()" class="btn btn--mod">End Party</button></div>
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
      isConnected: false,
      hostParty: {},
      hostPartyTicket: '',
      partyCode: '',
      selectedGame: 'poem',
      parties: [],
      isMod: this.$route.query.role === 'mod',
      wordList,
    }
  },
  
  async fetch() {
    this.parties = await fetch('/api/party', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())

    if (this.parties.length === 1 && this.$route.query.role !== 'mod') {
      this.$router.push({
        path: `/party/${this.parties[0].id}`,
        query: this.$route.query,
      })
    }
  },

  mounted() {
    console.log('hi')


    this.hostPartyTicket = Math.floor(Math.random() * 1000000)
    socket.on('add-word', this.handleUpdate)
    socket.connect()
  },

  beforeDestroy() {
    console.log('bye')

    // socket.off('party-update', this.receivePartyUpdate)
    // socket.off('party-end', this.receivePartyEnd)
  },

  methods: {
             handleUpdate(a,b,c, d) {
             console.log('update!')
             if (d === this.socket.id) {
             return
             }

               console.log('client received add-word', a, 'from socket id', d)
                 //this.wordList = c
                 // const blanks = this.$children.filter(i => i._name === '<WordSelector>')
                 // blanks[b].setWord('ayo')
             },
  },
}
</script>

<style>
p {
  margin: 3rem 0;
}
</style>
