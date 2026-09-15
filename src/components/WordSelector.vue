<template>
  <span style="position: relative;">
    <!-- 

      sorry about how weirdly this is formatted.
      it's formatted this way in order to prevent whitespace
      between most of the tags which helps prevent some
      text from reflowing when the state changes.

    -->
    <span v-bind:class="{
    'word-selector': true,
    'word-selector--is-being-edited': isBeingEdited,
    'word-selector--is-being-edited-by-me': isBeingEditedByMe,
    }"><button v-if="!isLocked && !isBeingEdited" @click="openWordList" :class="{ 'word-present': !!word }">{{ word || underscores }}</button><button @click="closeWordList" :class="{ 'word-present': !!word }" v-else>{{ word || underscores }}</button></span><div v-if="isBeingEditedByMe" v-bind:class="['word-list', anchor ? `word-list--anchor-${anchor}` : null,]"><div v-bind:class="[lengthClass]"><button v-for="word in wordList.filter(w => w.length === parseInt(length, 10))" @click="submitWord" :disabled="isWordUsed(word)">{{word}}</button></div></div>
  </span>
</template>

<script>
export default {
  props: ['index', 'length', 'anchor', 'wordList', 'blankList', 'socket', 'isLocked'],
  data() {
    return {
      lengthClass: `word-group word-group--length-${this.length}`,
      wordListClass: 'word-list',
    }
  },
  computed: {
    "underscores": function() {
      return "＿".repeat(parseInt(this.length, 10))
    },
    "blankValue": function() {
      return this.blankList[this.index]
    },
    "isBeingEditedByMe": function() {
      return this.blankValue === this.socket.id && typeof this.socket.id !== 'undefined'
    },
    "isBeingEdited": function() {
      return !!this.blankValue && this.blankValue.length === 20
    },
    "word": function() {
      // a blank holds a socket id (20 chars) while someone has it open, and
      // the chosen word otherwise
      return (this.blankValue && !this.isBeingEdited) ? this.blankValue : ''
    },
  },
  methods: {
    openWordList() {
      this.socket.emit('open word selector', this.index)
      this.$emit('wordSelectorOpen', this.index)
    },
    closeWordList() {
      this.socket.emit('close word selector', this.index)
      this.$emit('wordSelectorClose')
    },
    isWordUsed(word) {
      return this.blankList.indexOf(word) > -1
    },
    submitWord(e) {
      const to = e.target.innerHTML
      const from = this.word

      this.socket.emit('submit word', to, from, this.index, (err) => {
        if (err) {
          // the server rejected it, so blankList (and this.word) is already
          // back to how it was - nothing to revert
          alert(err.err)
        }
      })
    },
  },
}
</script>

<style>
  button {
    display: inline-block;
    color: inherit;
  }

  .word-selector {
    position: relative;
    display: inline-block;
    opacity: 1;
    line-height: 1;
  }

  .word-present {
    color: #45818E;
  }

  @keyframes blink {
    from {
      transform: scale(0.9, 0.8);
      opacity: 1;
    }
    to {
      transform: scale(0.8, 1);
      opacity: 0.8;
    }
  }
  .word-selector--is-being-edited {
    background: #aaa;
    color: transparent;
    animation: blink 500ms infinite alternate;
    transform-origin: 50% 100%;
  }
  .word-selector--is-being-edited-by-me {
    background: #54f;
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
  button:disabled {
    color: inherit;
    opacity: 0.2;
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
    z-index: 1;
    position: absolute;
    top: 100%;
    left: 50%;
    margin-top: 0.1em;
    z-index: 1;
    transform: translate3d(-50%,0,0);
  }

  .word-list--anchor-left {
    left: 0;
    transform: none;
  }

  .word-list--anchor-right {
    left: auto;
    right: 0;
    transform: none;
  }

  .word-group {
    text-align: center;
  }
  .word-group {
  }
  .word-group--length-1 {
    width: 8.5em;
  }
  .word-group--length-2 {
    width: 11.5em;
    font-size: 0.9em;
  }
  .word-group--length-4 {
  }
  .word-group--length-1 button {
    width: 2em;
    height: 2.2em;
  }
  .word-group--length-2 button {
    width: 2.7em;
    height: 2.2em;
  }
  .word-group--length-4 button {
    width: 4.5em;
    height: 2.2em;
  }


</style>
