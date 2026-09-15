export default {
  namespaced: true,

  state: () => ({
    people: ['garcia', 'geogh'],
  }),

  mutations: {
    increment(state) {
      state.counter++
    },
  },
}
