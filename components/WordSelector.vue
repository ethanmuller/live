<template>
  <span>
    <span v-if="isLocked">{{ word }}</span>
    <span v-if="!isLocked" class="word-selector">
      <button @click="editBlank">{{ word || "＿".repeat(parseInt(length, 10)) }}</button>
    </span>
  </span>
</template>

<script>
export default {
  props: ['length', 'wordList', 'blankList', 'socket', 'isLocked'],
  data() {
    return {
      word: "",
      pastWords: [],
    }
  },
  watch: {
    "word": function(to, from) {
      this.pastWords.unshift(to)
    },
  },
  methods: {
    editBlank() {
      const i = this.findIndexOfInstance(this)
      this.socket.emit('open word selector', i)
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
      console.log('submitting word', this.word)

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

    transition: all 250ms ease-out;
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
</style>
