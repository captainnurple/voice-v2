export default {
  namespaced: true,
  state: {
    // token: null,
    user: window.localStorage.getItem("user"),
  },
  getters: {
    getUserStatus: (state) => {
      return !!state.user;
    },
    getUser: (state) => {
      return JSON.parse(state.user);
    },
  },
  mutations: {
    setUser: (state, currentUser) => {
      if (!currentUser) {
        console.log("clearing user");
        state.user = null;
        window.localStorage.removeItem("user");
        return;
      }
      let theUser = JSON.stringify(currentUser);
      state.user = theUser;
      window.localStorage.setItem("user", theUser);
    },
  },
  actions: {
    updateUser: ({ commit }, payload) => {
      console.log("Inside updateUser");
      // console.log(JSON.stringify(payload, null, 2));
      commit("setUser", payload.currentUser);
    },
  },
};
