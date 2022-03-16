<template>
<main class="main main--home">
  <strong>you are on the secret /mod page</strong>
  
  <div class="join-chunk">
    <h2>Open Parties</h2>

    <div v-if="parties.length < 1">there are no active parties</div>
    <ul class="list-of-parties">
      <li v-for="party in parties">
        <NuxtLink :to="`/party/${party.id}`">{{party.id}}</NuxtLink>, {{party.memberCount}} members
      </li>
    </ul>
  </div>

  <!-- Nothing is happening here right now. -->
  <!--   <form @submit.prevent="joinParty" class="input-and-button"> -->
  <!--     <label> -->
  <!--       <span class="input-label">Party Code</span> -->
  <!--       <input type="text" v-model="partyCode"> -->
  <!--       <span class="hint" v-if="partyCode.length > 4">Code should be no more than 4 characters</span> -->
  <!--     </label> -->
  <!--     <button class="btn btn--primary join-button" :disabled="partyCode.length !== 4">Join</button> -->
  <!--   </form> -->

    <div class="host-note">
      <form @submit.prevent="createParty">
        <label>
          Game
          <select v-model="selectedGame" required>
            <option value="poem">Poem</option>
            <!-- <option value="masks">Masks</option> -->
            <!-- <option value="quest">Quest</option> -->
          </select>
        </label>
        <button class="btn btn--sm">Create Party</button>
      </form>
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
      selectedGame: 'poem',
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
