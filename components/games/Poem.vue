<template>
  <main class="main">

uh: {{isConnected}}
    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" style="padding: 0.5rem; display: inline-block;">&lt;- Party Index</NuxtLink>

    <div id="poemcontainer">
      <p>The
        <WordSelector type='adjective' :wordList='wordList' />
        <WordSelector type='noun' :wordList='wordList' />
        <WordSelector type='verbed' :wordList='wordList' />
        the
        <WordSelector type='adjective' :wordList='wordList' />
        <WordSelector type='noun' :wordList='wordList' /></p>
      <p>But this caused the
        <WordSelector type='noun' :wordList='wordList' />
        to
        <WordSelector type='verb' :wordList='wordList' />
        <WordSelector type='adverbly' :wordList='wordList' /></p>
    </div>

    <div class="mod-panel" v-if="isMod">
      <span class="mod-panel__title">Mod Panel</span>
      <div class="host-note"><button @click="endPartyButton()" class="btn btn--mod">End Party</button></div>
    </div>
  </main>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'

export default {
  data() {
    return {
      isConnected: false,
      hostParty: {},
      hostPartyTicket: '',
      partyCode: '',
      selectedGame: 'poem',
      parties: [],
      isMod: this.$route.query.role === 'mod',
      wordList: {
        'noun': {
          'fox': -1,
          'dog': -1,
          'cat': -1,
          'horse': -1,
          'cow': -1,
          'tardigrade': -1,
          'baby': -1,
          'elder': -1,
          'giraffe': -1,
          'yak': -1,
          'octopus': -1,
          'rock': -1,
          'couch': -1,
          'loaf of bread': -1,
        },
        'adjective': {
          'quick': -1,
          'brown': -1,
          'lazy': -1,
          'pale': -1,
          'wacky': -1,
          'indescribable': -1,
          'nondescript': -1,
          'long-haired': -1,
        },
        'verb': {
          'fall asleep': -1,
          'jolt awake': -1,
          'flop over': -1,
          'think deeply': -1,
          'smile': -1,
        },
        'verbed': {
          'jumped over': -1,
          'slipped past': -1,
          'crept by': -1,
          'completely ignored': -1,
          'sniffed': -1,
          'talked to': -1,
          'became': -1,
        },
        'adverbly': {
          'immediately': -1,
          'violently': -1,
          'peacefully': -1,
          'freely': -1,
          'gracefully': -1,
          'clumsily': -1,
        },
      },
    }
  },
  
  mounted() {
    this.hostPartyTicket = Math.floor(Math.random() * 1000000)
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
    socket.on('connect', this.handleConnect)
    socket.on('disconnect', this.handleDisconnect)

    socket.connect()
    // socket.on('party-update', this.receivePartyUpdate)
    // socket.on('party-end', this.receivePartyEnd)

    // this.connect()
  },

  beforeDestroy() {
    console.log('bye')
    socket.disconnect()

    socket.off('connect', this.handleConnect)
    socket.off('disconnect', this.handleDisconnect)
    // socket.off('party-update', this.receivePartyUpdate)
    // socket.off('party-end', this.receivePartyEnd)
  },

  methods: {
    async createParty() {
        const data = {
             ticket: this.hostPartyTicket,
             selectedGame: this.selectedGame,
        }

      const response = await fetch('/api/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJSON = await response.json()

      this.$router.push({
        name: 'party-party',
        params: {
          party: responseJSON.id,
          role: 'host',
          ticket: this.hostPartyTicket,
        },
        query: {
          role: 'mod',
        },
      })
      // $router.push({name: 'next-page', params: {foo: 1}})
    },
    handleConnect() {
      this.isConnected = true

      socket.emit('party-join', { party: this.$route.params.party, type: this.$route.query.role || 'player' })
    },
    handleDisconnect() {
      this.isConnected = false
    },
    joinParty() {
      this.$router.push({
        name: 'party-party',
        params: {
          party: this.partyCode,
          role: 'guest',
        },
      })
    },
    endParty() {
      this.$router.push({ path: '/', query: this.$route.query })
    },
    endPartyButton() {
        if (this.people?.length < 2 || confirm(`This will kick everybody out of the party. You're sure you want to do this?`)) {
        socket.emit('party-end')
        this.endParty()
      }
    },
  },
}
</script>

<style>
p {
  margin: 3rem 0;
}
</style>
