import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {}, // ユーザー情報
    cards: [], // ユーザーのカード
  },
  mutations: {
    setLoginUser(state, user) {
      state.user = user;
    },
    doLogout(state) {
      state.user = {};
    },
    clearCards(state) {
      state.cards = [];
    },
    fetchCards(state, { id, index, cardName, memos }) {
      state.cards.push({ id, index, cardName, memos });
    },
  },
  actions: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    // ログアウト処理
    doLogout({ commit }) {
      firebase.auth().signOut();
      commit("doLogout");
    },
    // ユーザー情報のセット
    setLoginUser({ commit }, user) {
      commit("setLoginUser", user);
    },
    setMemoList({ commit }, val) {
      commit("setMemoList", val);
    },
    // stateのcardsをクリアする
    clearCards({ commit }) {
      commit("clearCards");
    },
    // ユーザーのカードを取得
    fetchCards({ dispatch, getters, commit }) {
      firebase
        .firestore()
        .collection(`users/${getters.uid}/cards`)
        .orderBy("index", "asc")
        .onSnapshot((snapshot) => {
          dispatch("clearCards");
          snapshot.forEach((doc) => {
            commit("fetchCards", {
              id: doc.id,
              index: doc.get("index"),
              cardName: doc.get("cardName"),
              memos: doc.get("memos"),
            });
          });
        });
    },
  },
  getters: {
    uid: (state) => (state.user ? state.user.uid : ""),
    displayName: (state) => (state.user ? state.user.displayName : ""),
    photoURL: (state) => (state.user ? state.user.photoURL : ""),
    cards: (state) => (state.cards ? state.cards : ""),
  },
});
