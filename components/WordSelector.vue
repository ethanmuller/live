<template>
  <span class="word-selector">
    <label>
      <!--<span class="tx-smol">
        {{ type }}
      </span>-->
      <select @change="addWord" v-model="word" :data-word="word">
        <option v-if="type=='one'" value="" selected="" disabled="" hidden="">＿</option>
        <option v-if="type=='two'" value="" selected="" disabled="" hidden="">＿＿</option>
        <option v-if="type=='four'" value="" selected="" disabled="" hidden="">＿＿＿＿</option>
        <option v-for="availability, word in wordList[type]" :disabled="isWordUsed(word)" :value="word" :data-word="word">{{ word }}</option>
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
      pastWords: [],
    }
  },
  watch: {
    "word": function(to, from) {
      this.pastWords.unshift(to)
    },
  },
  methods: {
    setWord(word) {
      this.word = word
    },
    findIndexOfInstance(self) {
      // this is a dodgy function, but it's what we use
      // to figure out which Nth word this component represents
      return self.$parent.$children
        .filter(c => c._name === '<WordSelector>')
        .indexOf(this)
    },
    isWordUsed(word) {
      let allWords = []

      Object.keys(this.wordList).forEach((g) => Object.keys(this.wordList[g]).forEach(w => {
        if (w === word) {
        }
      }))

      return allWords.indexOf(word) > -1
    },
    addWord(e) {
      const i = this.findIndexOfInstance(this)
      const to = this.word
      const from = this.pastWords[0]
      this.socket.emit('update', to, from, i, (err) => {
        if (err) {
          // revert back to previous state
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
    line-height: 1.2;
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
    color: #45818E;
  }
  select::-ms-expand {
    display: none;
  }
  option {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: center;
    font-family: 'Noto Sans TC', sans-serif;background-color: transparent;
  }
  
  [data-word='他'], [data-word='我']  {
    color: #4A2B9A;
  }
  [data-word='九月'], [data-word='時間'], [data-word='冬天']  {
    color: #BE9D57;
  }
  [data-word='遺忘'], [data-word='弄丟'], [data-word='原諒']  {
    color: #A8214C;
  }
  [data-word='子彈'], [data-word='獵槍'], [data-word='鋼琴'], [data-word='森林']  {
    color: #2E7B30;
  }
  option[disabled] {
    color: #d2d2d2;
  }
</style>
