<template>
  <div>
    <img v-if="ravenState !== 'voting'" src="@/static/raven_transparent.gif" width="128" height="128" class="raven" />
    <div v-if="ravenState=='intro' || ravenState=='end'">
      <h1><span style="font-family: 'Noto Sans TC', sans-serif;">烏鴉</span> Raven</h1>
      <div v-if="ravenState=='intro'">
        <p style="text-align:center;">wait for it...</p>
      </div>
    </div>
    <div v-if="!isScreen">
      <div v-if="ravenState=='results'" class="results">
        The two chosen:
        <div>
          <div class="result" v-for="i in orderedVotes.slice(0,2)">
            <strong>{{displayText[i[0]]}}</strong>

            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z" />
            </svg> &times; {{i[1]}}
          </div>
        </div>
      </div>
      <div v-if="ravenState=='voting'">

        <button v-for="numVotes, instrument in votes" @click="triggerVote(instrument)" class="vote-btn">
          <span class="results-bg"></span>
          <span class="results-bar" :style="{ width: `${ numVotes / Math.max(totalVotes, 1) * 100 }%` }"></span>
          {{displayText[instrument]}}


          <span class="vote-count">{{numVotes}}</span>
          <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z" />
          </svg>

        </button>
      </div>
    </div>
    <div v-if="isScreen" class="screen">
      <div v-if="ravenState=='results'" class="results">
        The two chosen:
        <div>
          <div class="result" v-for="i in orderedVotes.slice(0,2)">
            <strong>{{displayText[i[0]]}} </strong>

            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z" />
            </svg> &times; {{i[1]}}
          </div>
        </div>
      </div>

      <div v-if="ravenState=='voting'">

        <TransitionGroup name="list" tag="ul">
          <li v-for="item in orderedVotes" :key="item[0]" class="" class="vote-btn">
            <span class="results-bg"></span>
            <span class="results-bar" :style="{ width: `${ item[1] / Math.max(totalVotes, 1) * 100 }%` }"></span>
            {{displayText[item[0]]}}

            <span class="vote-count">{{item[1]}}</span>
            <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0562 5.67499L15.5 6.52989L15.9438 5.67499C17.1005 3.44663 19.2907 1.70064 21.6021 0.929149C23.9163 0.156704 26.2417 0.388316 27.7838 1.9284C31.4054 5.54518 31.4054 11.4089 27.7838 15.0257L15.5 27.2934L3.21616 15.0257C-0.405386 11.4089 -0.405386 5.54518 3.21616 1.9284C4.75827 0.388316 7.08371 0.156704 9.39794 0.929149C11.7093 1.70065 13.8995 3.44663 15.0562 5.67499Z" />
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

      ravenState: 'intro',
      votes: {
        Piano: 0,
        Guitar: 0,
        Bass: 0,
        Drums: 0,
      },

      displayText: {
        Piano: "Piano 🎹",
        Guitar: "Guitar 🎸",
        Bass: "Bass 🎻",
        Drums: "Drums 🥁"
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
      let ordered = votesArray.sort((a, b) => { return b[1] - a[1] })

      if (this.isScreen && this.ravenState == 'voting')
        return ordered;

      // make sure that if any top 2 are tied, to randomize it a bit each time to prevent cases like:
      // if "Piano" is tied with anybody, it will always win, because its earlier appearance on the votes array
      // But also everyone should compute the same "random" :S

      // In this case, I'm using the total number of votes as a syncronized "random" number seed
      // We could change this for a real sync random
      let totalVotes = 1
      Object.values(this.votes).forEach(n => {
        totalVotes += n
      })

      // Check for ties
      const topCount = 2
      for (let i = 0; i < topCount;) {
        let sameVotes = 1
        for (let j = i + 1; j < ordered.length && ordered[i][1] == ordered[j][1]; ++j) {
          sameVotes++
        }

        if (i + sameVotes > topCount) // "randomize" tied votes
        {
          let newOrderValue = {}
          for (let j = 0; j < sameVotes; ++j) {
            newOrderValue[ordered[i + j][0]] = (j + totalVotes) * 17 % sameVotes // randomish order using a * prime
          }
          let reorderedSubarray = ordered.splice(i, sameVotes).sort((a, b) => { return newOrderValue[b[0]] - newOrderValue[a[0]] })
          ordered.splice(i, 0, ...reorderedSubarray)
        }

        i += sameVotes;
      }
      return ordered
    }
  },

  mounted() {

    this.socket.on('new state', this.setState)
    this.socket.emit('join', (state) => {
      this.votes = state.votes
      this.ravenState = state.ravenState
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
      this.ravenState = newState.ravenState
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
  padding: 1em;
  margin: 1em;

  border-radius: 8px;

  border: 1px solid #aaa;
  font-size: 1.5em;
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
h1 {
    text-align: center;
}

.raven {
    image-rendering: pixelated;
    display: block;
    margin: auto;
}
</style>
