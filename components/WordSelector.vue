<template>
  <span class="word-selector">
    <label>
      <!--<span class="tx-smol">
        {{ type }}
      </span>-->
      <select @change="addWord" v-model="word" :data-length="length">
        <option v-if="length=='1'" value="" selected="" disabled="" hidden="" :data-length="length">＿</option>
        <option v-if="length=='2'" value="" selected="" disabled="" hidden="" :data-length="length">＿＿</option>
        <option v-if="length=='4'" value="" selected="" disabled="" hidden="" :data-length="length">＿＿＿＿</option>
        <!-- todo: filter by length-->
        <option v-for="word in wordList.filter(w => w.length === parseInt(length, 10))" :value="word" :data-word="word" :data-length="length" :disabled="isWordUsed(word)">{{ word }}</option>
      </select>
    </label>
  </span>
</template>

<script>
export default {
  props: ['length', 'wordList', 'blankList', 'socket'],
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
    display: inline-block;
    height: 35px;
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
    background-color: transparent;
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

    /*[data-word='他'], [data-word='我']  {
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
  }*/
  option[disabled] {
    color: #d2d2d2;
  }
</style>
