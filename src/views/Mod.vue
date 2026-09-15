<template>
<main class="main main--home">
  <strong>you are on the secret /mod page</strong>

  <div class="join-chunk">
    <h2>Open Parties</h2>

    <div v-if="parties.length < 1">there are no active parties</div>
    <ul class="list-of-parties">
      <li v-for="party in parties" :key="party.id">
        <router-link :to="{ path: `/party/${party.id}`, query: { role: 'mod' } }">{{party.id}}</router-link>, {{party.memberCount}} members
      </li>
    </ul>
  </div>

    <div class="host-note">
      <form @submit.prevent="createParty">
        <label>
          Game
          <select v-model="selectedGame" required>
            <option value="poem">Poem</option>
            <option value="quest">Quest</option>
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

  created() {
    this.fetchParties()
  },

  methods: {
    async fetchParties() {
      this.parties = await fetch('/api/party', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(res => res.json())
    },

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

      // this directs the user to the newly created party
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
