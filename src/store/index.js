import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cards: [
      {
        id: "1",
        title: "TO DO",
        contents: [
          "掃除",
          "洗濯",
          "買い物",
          "ゴミ捨て",
        ]
      },
      {
        id: "2",
        title: "Study",
        contents: [
          "Vue.js",
          "Typescript",
          "JavaScript",
        ]
      },
    ]
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    list: (state) => state.list
  }
})
