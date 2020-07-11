import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    themeColor: "#FFFFFFFF", // テーマカラー
    colors: {
      red: "#F4433654",
      purple: "#9C27B054",
      blue: "#2196F366",
      teal: "#00968866",
      green: "#4CAF5066",
      orange: "#FF980054",
      "blue-grey": "#607D8B66",
    }, // デフォルトのテーマカラーセット
    user: {}, // ユーザー情報
    cards: [], // ユーザーのカード
  },
  mutations: {
    setLoginUser(state, user) {
      state.user = user;
    },
    doLogout(state) {
      state.themeColor = "#FFFFFFFF";
      state.user = {};
      state.cards = [];
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
    // 匿名ログイン
    doAnonymousLogin() {
      firebase
        .auth()
        .signInAnonymously()
        .catch((error) => {
          console.log(alert(error.message));
        });
    },
    // ログアウト処理
    doLogout({ commit }) {
      firebase.auth().signOut();
      commit("doLogout");
    },
    // ユーザー情報のセット
    setLoginUser({ getters, dispatch, commit }, user) {
      commit("setLoginUser", user);
      const users = [];
      firebase
        .firestore()
        .collection("users")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            users.push(doc.id);
          });
        })
        .then(() => {
          // 初めて利用するユーザーならusersにドキュメントを追加し、初期テーマカラーをセットする
          if (!users.includes(getters.uid)) {
            firebase
              .firestore()
              .collection("users")
              .doc(getters.uid)
              .set({
                themeColor: "#00968866",
              })
              .then(() => {
                dispatch("fetchThemeColor");
              });
          } else {
            // 既存ユーザーならテーマカラーを取得する
            dispatch("fetchThemeColor");
          }
        });
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
        .onSnapshot(
          (snapshot) => {
            dispatch("clearCards");
            snapshot.forEach((doc) => {
              commit("fetchCards", {
                id: doc.id,
                index: doc.get("index"),
                cardName: doc.get("cardName"),
                memos: doc.get("memos"),
              });
            });
          },
          () => {}
        );
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
    // 設定したテーマカラーをFirebaseに保存する
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
    cards: (state) => state.cards,
  },
});
