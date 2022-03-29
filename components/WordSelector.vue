<template>
  <span class="word-selector">
    <label>
      <!--<span class="tx-smol">
        {{ type }}
      </span>-->
      <select @change="addWord" v-model="word">
        <option v-if="type=='one'" value="" selected="" disabled="" hidden="">＿</option>
        <option v-if="type=='two'" value="" selected="" disabled="" hidden="">＿＿</option>
        <option v-if="type=='four'" value="" selected="" disabled="" hidden="">＿＿＿＿</option>
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
      word: "",
    }
  },
  methods: {
    setWord(word) {
      this.word = word
      this.$el.dataset.word = this.word
      console.log(this.$el)
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
    line-height: 2;
    display: inline-block;
  }
  select, option {
    font-family: inherit;
    font-size: 1em;
  }
  .undefined {
    color: black;
  }

  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0px;
    text-align: center;
  }
  select::-ms-expand {
    display: none;
  }
  option {
    text-align: center;
    font-family: 'Noto Sans TC', sans-serif;
  }
  
  span[data-word='他']  {
    color: #4A2B9A;
  }
</style>
