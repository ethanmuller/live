<template>
  <span class="word-selector">
    <label>
      <span class="tx-smol">
        {{ type }}
      </span>
      <select>
        <option value=""></option>
        <option v-for="availability, word in wordList[type]">{{ word }}</option>
      </select>
    </label>
  </span>
</template>

<script>
export default {
  props: ['type', 'wordList'],
  methods: {
    sayType() {
      console.log(this.wordList[this.type])
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
