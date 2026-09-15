import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import identity from './modules/identity'
import party from './modules/party'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  key: 'quest-vuex',
  storage: window.localStorage,
  reducer: (state) => ({ identity: state.identity }),
})

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
    identity,
    party,
  },

  plugins: [vuexPersist.plugin],
})

export default store
