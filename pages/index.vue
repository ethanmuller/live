<template>
<main class="main main--home">
  
  <div class="join-chunk">
    <div v-if="parties.length < 1">Nothing is happening here right now.</div>
    <div v-else>
      active parties:
      <ul class="list-of-parties">
        <li v-for="party in parties">
          <NuxtLink :to="`/party/${party.id}`">{{party.id}}</NuxtLink>, {{party.memberCount}} members
        </li>
      </ul>
    </div>
  </div>
</main>
</template>

<script>
export default {
  data() {
    return {
      hostParty: {},
      hostPartyTicket: '',
      partyCode: '',
      selectedGame: '',
      parties: [],
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

    console.log(this.parties.length)
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
</style>
