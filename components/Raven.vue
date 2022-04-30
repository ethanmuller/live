<template>
  <div>
    <div v-if="!isScreen">
      <div v-if="betweenRounds" class="results">
        Top 2:

        <div>
          <div class="result" v-for="i in orderedVotes.slice(0,2)">
            <strong>{{i[0]}}: </strong>

            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z"/>
            </svg> &times; {{i[1]}}
          </div>
        </div>
      </div>
      <div v-if="!betweenRounds">

        <button v-for="numVotes, instrument in votes" @click="triggerVote(instrument)" class="vote-btn">
          <span class="results-bg"></span>
          <span class="results-bar" :style="{ width: `${ numVotes / Math.max(totalVotes, 1) * 100 }%` }"></span>
          {{instrument}}


          <span class="vote-count">{{numVotes}}</span>
          <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z"/>
          </svg>

        </button>
      </div>
    </div>
    <div v-if="isScreen" class="screen">
      <div v-if="betweenRounds" class="results">
        Top 2:

        <div>
          <div class="result" v-for="i in orderedVotes.slice(0,2)">
            <strong>{{i[0]}}: </strong>

            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z"/>
            </svg> &times; {{i[1]}}
          </div>
        </div>
      </div>

      <div v-if="!betweenRounds">

        <TransitionGroup name="list" tag="ul">
          <li v-for="item in orderedVotes" :key="item[0]" class="" class="vote-btn">
            <span class="results-bg"></span>
            <span class="results-bar" :style="{ width: `${ item[1] / Math.max(totalVotes, 1) * 100 }%` }"></span>
            {{item[0]}}

            <span class="vote-count">{{item[1]}}</span>
            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z"/>
            </svg>

          </li>
        </TransitionGroup>

      </div>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io-client.js'
import wordList from '../fei-words.js'


export default {
  data() {
    return {
      socket: socket,
      isMod: this.$route.query.role === 'mod',
      isScreen: this.$route.query.role === 'screen',
      wordList,
      blankList: new Array(wordList.length),
      isLocked: false,
      url: '',

      betweenRounds: false,
      votes: {
        Piano: 0,
        Guitar: 0,
        Bass: 0,
        Drums: 0,
      }

      // Only one WordSelector is allowed open at a time.
      // This represents the index of the one that's open.
      //openWordSelectorIndex: -1,
    }
  },

  computed: {
    totalVotes() {
      let num = 0

      Object.values(this.votes).forEach(n => {
        num += n
      })

      return num
    },
    orderedVotes() {
      const votesArray = Object.entries(this.votes)
      return votesArray.sort((a,b) => { return b[1] - a[1]})
    }
  },

  mounted() {

    this.socket.on('new state', this.setState)
    this.socket.emit('join', (state) => {
      this.votes = state.votes
      this.betweenRounds = state.betweenRounds
    })
  },

  beforeDestroy() {
  },

  methods: {
    connect() {
      console.log('connected')
    },
    triggerVote(instrument) {
      this.socket.emit('send vote', instrument)
    },

    setState(newState) {
      this.votes = newState.votes
      this.betweenRounds = newState.betweenRounds
    },
  },
}
</script>

<style>
.vote-btn {
  background: white;
  border-radius: 0 0 8px 8px;
  padding: 1.2em 1em 0.8em;
  width: 16em;
  display: block;
  margin: 1em 0;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);

  text-align: left;
  font-size: 1.2em;
  font-weight: bold;

  touch-action: manipulation;

  display: flex;
  justify-content: space-between;

  position: relative;
}

.vote-count {
  font-weight: normal;
  margin-left: auto;
  margin-right: 0.5em;
  text-align: right;
  transition: all 0.2s;
}

.vote-btn:active .vote-count {
  transition: none;
 transform: translate3d(-20px, 0, 0);
}

.vote-btn svg {
  width: 1em;
  height: 1em;
  overflow: visible;
  z-index:1;
  position: relative;
  align-self: center;
}

.vote-btn svg path {
  transition: all 0.2s;
  fill: white;
 stroke: #C4C4C4;
 transform: scale(1);
 transform-origin: 50%;
}

.vote-btn:active svg path {
  transition: none;
  fill: red;
 stroke: red;
 transform: scale(3);
}


.results-bar, .results-bg {
  position: absolute;
  background: green;
  display: block;
  height: 0.5em;
  width: 100%;
  top: 0;
  left: 0;
}

.results-bg {
  background: #efefef;
}

.results {
  text-align: center;
}

.results svg {
  vertical-align: middle;
  margin-left: 1em;
}
.results svg path {
  fill: red;
  stroke: red;
}

.result {
  padding: 2em;
  margin: 1em;

  border-radius: 8px;

  border: 1px solid #aaa;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

.screen {
  text-align: center;
  font-size: 1.3em;
}
.screen svg path {
  fill: red;
  stroke: red;
}
</style>
