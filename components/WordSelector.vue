<template>
  <span class="word-selector">
    <label>
      <select :data-word="word" @change="addWord" v-model="word" :data-length="length" :disabled="isLocked">
        <option value="" selected="" disabled="" hidden="" :data-length="length">{{"＿".repeat(parseInt(length, 10))}}</option>
        <option v-if="length=='1'" value="" selected="" disabled="" hidden="" :data-length="length">kF</option>
        <!-- todo: filter by length-->
        <option v-for="word in wordList.filter(w => w.length === parseInt(length, 10))" :value="word" :data-word="word" :data-length="length" :disabled="isWordUsed(word)">{{ word }}</option>
      </select>
    </label>
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
    color: #45818E;
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

  [disabled] {
  }
  [data-word='他'],
  [data-word='我']  {
    color: #4A2B9A;
  }
  [data-word='九月'],
  [data-word='時間'],
  [data-word='冬天']  {
    color: #BE9D57;
  }
  [data-word='遺忘'],
  [data-word='弄丟'],
  [data-word='原諒']  {
    color: #A8214C;
  }
  [data-word='子彈'],
  [data-word='獵槍'],
  [data-word='鋼琴'],
  [data-word='森林']  {
    color: #2E7B30;
  }
</style>
