import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    themeColor: "#FFFFFFFF", // テーマカラー
    colors: {
      red: "#F4433688",
      purple: "#9C27B088",
      blue: "#2196F388",
      teal: "#00968888",
      green: "#4CAF5088",
      orange: "#FF980088",
      "blue-grey": "#607D8B88",
    }, // デフォルトのテーマカラーセット
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
    setThemeColor(state, color) {
      state.themeColor = color;
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
    // 設定したテーマカラーを取得する
    fetchThemeColor({ getters, commit }) {
      firebase
        .firestore()
        .collection("users")
        .doc(`${getters.uid}`)
        .get()
        .then((doc) => {
          commit("setThemeColor", doc.data().themeColor);
        });
    },
    // テーマカラーを設定する
    setThemeColor({ getters, commit }, color) {
      commit("setThemeColor", color);
      firebase
        .firestore()
        .collection("users")
        .doc(`${getters.uid}`)
        .update({ themeColor: color });
    },
  },
  getters: {
    uid: (state) => (state.user ? state.user.uid : ""),
    displayName: (state) => (state.user ? state.user.displayName : ""),
    photoURL: (state) => (state.user ? state.user.photoURL : ""),
    cards: (state) => (state.cards ? state.cards : ""),
    // themeColor: (state) => (state.themeColor ? state.themeColor : ""),
  },
});
