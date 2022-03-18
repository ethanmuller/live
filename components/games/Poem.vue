<template>
<div>
  <div v-show="isScreen" style="position: absolute; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0)">
    <canvas ref="canvas"></canvas>
    <div v-if="url.indexOf('localhost') > -1"><strong>warning: QR Code is pointing to "localhost"</strong></div>
  </div>
  <div v-if="isConnected && !isScreen">
    <NuxtLink :to="{ path: '/', query: this.$route.query }" v-if="isMod" style="padding: 0.5rem; display: inline-block;">&lt;- Party Index</NuxtLink>
    <div style="padding: 1.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <p v-if="people.length === 1" style="opacity: 0.2">You are here by yourself.</p>
        <p v-else-if="people.length === 2">There's 1 other person here.</p>
        <p v-else-if="people.length > 2">There's {{ people.length - 1 }} other people here.</p>
      </div>
      <!-- <div class="party-header">Party Code: <strong>{{ this.partyRoom.id.toUpperCase() }}</strong></div> -->
      <div v-if="!isScreen">
        <div v-if="!identitySet">
          <form>
            <label for="name-entry" class="text-label">What are you called?</label>
            <div class="name-entry">
              <input type="text" v-model="nickname" required id="name-entry">
              <button @click="saveNickname" class="btn btn--primary">Save</button>
            </div>
            <!-- <button @click="resetNickname" class="btn">Cancel</button> -->
          </form>
        </div>
        <main v-if="identitySet">
          <div class="party-chunk">
            <ul class="party-list">
              <li v-for="member in people">
                <button class="party-list__item" @click="editIdentity" v-if="member.id === socket.id">
                  <!-- this is a button that renders the current user -->
                  <!-- separately from the party they are in -->
                  {{ member.nickname }} <span class="emoji-icon">✏️</span>
                </button>
                <span v-else class="party-list__item" v-text="member.nickname || '...'">...</span>
              </li>
            </ul>
          </div>

        </main>
      </div>

    <div class="host-note" style="margin-top: 1.5rem"><button @click="endPartyButton()" class="btn btn--danger" v-if="isMod">End Party</button></div>
    </div>
  </div>

  <slot></slot>

  <div v-if="!isConnected">trying to connect...</div>
</div>
</template>

<script>
const QRCode = require('qrcode');


export default {
    props: ['socket', 'party', 'isConnected', 'partyRoom', 'people', 'endParty'],

    data() {
        return {
            identitySet: false,
            socketId: null,
            count: 0,
            nickname: this.$store.state.identity.nickname,
            url: '',
            isScreen: this.$route.query.role === 'screen',
            isMod: this.$route.query.role === 'mod',
        }
    },

    mounted() {
        if (this.nickname) {
            this.saveNickname()
        }

        if (this.isScreen) {
            this.url = window.location.protocol + '//' + window.location.host + window.location.pathname;

            const canvas = this.$refs.canvas;

            QRCode.toCanvas(canvas, this.url, {
                scale: 8,
                margin: 0,
                color: {
                    dark: '#000',  // Blue dots
                    light: '#0000' // Transparent background
                }
            }, function (error) {
                if (error) console.error(error)
                console.log('success!');
            })
        }
  },

  methods: {
    saveNickname() {
      if (this.nickname === '') {
        alert('Please enter a nickname to continue')
        return
      }

      this.identitySet = true

      // tell other party members
      this.socket.emit('party-set-nickname', this.nickname, this.$store.state.identity.nickname)

      // save in local storage
      this.$store.commit('identity/setNickname', this.nickname)
    },

    resetNickname() {
      this.identitySet = true
      this.nickname = this.$store.state.identity.nickname;
    },
    editIdentity() {
      this.identitySet = false
    },
    endPartyButton() {
        if (this.people.length < 2 || confirm(`This will kick everybody out of the party. You're sure you want to do this?`)) {
        this.socket.emit('party-end')
        this.endParty()
      }
    },
  }
}
</script>

