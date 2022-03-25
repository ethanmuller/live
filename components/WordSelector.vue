<template>
  <span class="word-selector">
    <label>
      <span class="tx-smol">
        {{ type }}
      </span>
      <select @change="addWord" v-model="word">
        <option value=""></option>
        <option v-for="availability, word in wordList[type]">{{ word }}</option>
      </select>
    </label>
  </span>
</template>

<script>
export default {
  props: ['type', 'wordList', 'socket'],
  data() {
    return {
      word: '',
    }
  },
  methods: {
    setWord(word) {
      this.word = word
    },
    addWord(e) {
      const i = this.$parent.$children.filter(c => c._name === '<WordSelector>').indexOf(this)
      this.socket.emit('update', this.word, i)
    },
  },
}
</script>

<style>
  button {
    display: inline-block;
  }
  .tx-smol {
    position: absolute;
    font-size: 0.7rem;
    top: -0.8em;
    left: 0;
    width: 100%;
    opacity: 0.3;
  }
  .word-selector {
    position: relative;
    line-height: 2.5;
    display: inline-block;
  }
  select, option {
    font-family: inherit;
    font-size: 1em;
  }
</style>
