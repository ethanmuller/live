export default {
  namespaced: true,

  state: () => ({
    nickname: '',
    avatarUrl: '',
  }),

  mutations: {
    setNickname(state, value) {
      state.nickname = value
    },
    setAvatarUrl(state, value) {
      state.avatarUrl = value
    },
  },
}
