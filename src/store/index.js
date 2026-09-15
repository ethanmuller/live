import Vue from 'vue'
import Vuex from 'vuex'

import party from './modules/party'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    counter: 0,
  },

  getters: {
    // when you gotta know if the counter is at three or not
    isCounterThree: (state) => state.counter === 3,
  },

  mutations: {
    increment(state) {
      state.counter++
    },
  },

  modules: {
    party,
  },
})

export default store
