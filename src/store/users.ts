interface State {
  userData: UserData;
}

interface UserData {
  name: string;
  pass: string;
  avatar: string;
  token: string;
}

export default {
  state: {
    userData: null
  },
  getters: {
    userData: (state: State) => state.userData
  },
  mutations: {
    updateUserData(state: State, userData: UserData) {
      state.userData = userData
    }
  },
  actions: {
    // actionUserData({ commit }, userData: Object) : any {
    //   commit('someMutation', userData)
    // }
  }
}
