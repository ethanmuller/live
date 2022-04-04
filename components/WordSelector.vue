<template>
  <span style="position: relative;">
    <span v-bind:class="{
    'word-selector': true,
    'word-selector--is-being-edited': isBeingEdited,
    'word-selector--is-being-edited-by-me': isBeingEditedByMe,
    }"><button v-if="!isLocked && !isBeingEdited" @click="openWordList">{{ underscores }}</button><span v-else>{{ word || underscores }}</span></span><div v-if="isBeingEditedByMe" class="word-list"><button v-for="word in wordList">{{word}}</button></div>
  </span>
</template>

<script>
export default {
  props: ['length', 'wordList', 'blankList', 'socket', 'isLocked'],
  data() {
    return {
      word: "",
      pastWords: [],
      isWordListOpen: false,
    }
  },
  watch: {
    "word": function(to, from) {
      this.pastWords.unshift(to)
    },
  },
  computed: {
    "underscores": function() {
      return "＿".repeat(parseInt(this.length, 10))
    },
    "isBeingEditedByMe": function() {
      // todo: move this method out of computed property.
      // maybe calculate index on mount instead?
      const i = this.findIndexOfInstance(this)
      return this.blankList[i] === this.socket.id
    },
    "isBeingEdited": function() {
      // todo: move this method out of computed property.
      // maybe calculate index on mount instead?
      const i = this.findIndexOfInstance(this)
      return this.blankList[i] && this.blankList[i].length === 20
    },
  },
  methods: {
    editBlank() {
    },
    openWordList() {
      this.isWordListOpen = true
      const i = this.findIndexOfInstance(this)
      this.socket.emit('open word selector', i)
    },
    closeWordList() {
      this.isWordListOpen = false
      const i = this.findIndexOfInstance(this)
      this.socket.emit('close word selector', i)
    },
    isWordUsed(word) {
      return this.blankList.indexOf(word) > -1
    },
    setWord(word) {
      this.word = word
    },
    findIndexOfInstance(self) {
      // this is a dodgy function, but it's what we use
      // to figure out the index this word lives at
      return self.$parent.$children
        .filter(c => c._name === '<WordSelector>') // Filter out other component types
        .indexOf(this)
    },
    addWord(e) {
      const i = this.findIndexOfInstance(this)
      const to = this.word
      const from = this.pastWords[0]

      this.socket.emit('submit word', to, from, i, (err) => {
        if (err) {
          // revert back to previous state
          alert(err.err)
          this.word = from
        }
      })
    },
  },
}
</script>

<style>
  button {
    display: inline-block;
  }

  .word-selector {
    position: relative;
    display: inline-block;
    transition: all 250ms ease-out;
    opacity: 1;
    line-height: 1;
  }

  @keyframes blink {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .word-selector--is-being-edited {
    background: #aaa;
    color: transparent;
    animation: blink 500ms infinite alternate;
  }
  .word-selector--is-being-edited-by-me {
    background: #54f;
  }
  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    .word-selector {
      margin: 0px -5px 0px -5px;
    }
  }
  select, option {
    font-family: inherit;
    font-size: 1em;
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0px;
    text-align: center;
    color: #000;
    background: white;
    border-radius: 7px;
    padding: 0 3px;
    margin: 0 3px;

  }
  select:disabled {
    background: transparent;
    padding: 0;
    margin: 0;
  }
  select::-ms-expand {
    display: none;
  }
  option {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: center;
    font-family: 'Noto Sans TC', sans-serif;
    background-color: transparent;
  }

  option[disabled] {
    color: #ddd;
  }


  .word-list {
    background: #FFFFFF;
    box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.09), 0px 33.2436px 29.2013px rgba(0, 0, 0, 0.0696101), 0px 5.32773px 14.1767px rgba(0, 0, 0, 0.0500626), 0px -6.98175px 6.94968px rgba(0, 0, 0, 0.0313772), 0px -8.15691px 2.74791px rgba(0, 0, 0, 0.013912);
    border-radius: 7px;
    position: absolute;
    top: 100%;
    left: 50%;
    z-index: 1;

    width: 5em;
    display: flex;
    flex-direction: column;
    transform: translate3d(-50%,0,0);

  }


</style>
