<template>
  <div>
    <component v-bind:is="gamesMap[partyRoom.selectedGame]" :socket="socket" :isConnected="isConnected" :partyRoom="partyRoom" :people="people" :endParty="endParty"></component>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
import mapState from 'vuex'

export default {
  data() {
    return {
      isConnected: false,
      people: [],
      partyRoom: {},
      identitySet: false,
      socket: null,
      count: 0,
      gamesMap: {
        quest: 'GamesQuest',
        masks: 'GamesMasks',
        poem: 'GamesPoem',
      },
    }
  },

  created() {
    this.socket = socket
  },
    
  async fetch() {
    this.partyRoom = await fetch(`/api/party/${this.$route.params.party}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if(res.ok) {
        return await res.json()
      } else {
        if (res.status === 404) {
          this.$router.push({ path: '/', query: this.$route.query })
        }
      }
    })
  },

  mounted() {
    socket.on('connect', this.handleConnect)
    socket.on('disconnect', this.handleDisconnect)
    socket.on('party-update', this.receivePartyUpdate)
    socket.on('party-end', this.receivePartyEnd)

    this.connect()
  },
  beforeDestroy() {
    this.disconnect()
    
    socket.off('connect', this.handleConnect)
    socket.off('disconnect', this.handleDisconnect)
    socket.off('party-update', this.receivePartyUpdate)
    socket.off('party-end', this.receivePartyEnd)
  },
  
  methods: {
    receivePartyEnd() {
      alert('this party is now over because somebody ended it')
      this.endParty()
    },
    endParty() {
      this.$router.push({ path: '/', query: this.$route.query })
    },
    handleConnect() {
      this.isConnected = true

      socket.emit('party-join', { party: this.$route.params.party, type: this.$route.query.role || 'player' })

      if (this.$route.query.role === 'screen') {
        this.socket.emit('party-set-nickname', 'screen')
      }

    },
    receivePartyUpdate(updatedParty) {
      this.people = updatedParty
    },
    handleDisconnect() {
      this.isConnected = false
      this.people = []
    },
    connect() {
      socket.connect()
    },
    disconnect() {
      socket.disconnect()
    },
  }    
}
</script>

