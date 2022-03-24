<template>
  <main class="main main--home">
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
  </main>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
console.log(socket)

export default {
  props: ['socket'],
  data() {
    return {
      hostParty: {},
      hostPartyTicket: '',
      partyCode: '',
      selectedGame: 'poem',
      parties: [],
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
    console.log(this.wordList)
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
    joinParty() {
      this.$router.push({
        name: 'party-party',
        params: {
          party: this.partyCode,
          role: 'guest',
        },
      })
    }
  },
}
</script>

<style>
p {
  margin: 3rem 0;
}
</style>
