import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cards: [
      {
        id: "1",
        title: "TO DO",
        memos: [
          { id: 1, value: "掃除" },
          { id: 2, value: "洗濯" },
          { id: 3, value: "買い物" },
          { id: 4, value: "ゴミ捨て" },
        ],
      },
      {
        id: "2",
        title: "Study",
        memos: [
          { id: 5, value: "JavaScript" },
          { id: 6, value: "TypeScript" },
          { id: 7, value: "Vue.js" },
        ],
      },
    ],
  },
  mutations: {
    // クリックされたカードと同じidのcardを削除
    deleteCard(state, cardId) {
      for (let i = 0; i < state.cards.length; i++) {
        if (state.cards[i].id === cardId) {
          state.cards.splice(i, 1);
        }
      }
    },
    // クリックされたメモと同じidのmemoを削除
    deleteMemo(state, memoId) {
      for (let i = 0; i < state.cards.length; i++) {
        for (let j = 0; j < state.cards[i].memos.length; j++) {
          if (state.cards[i].memos[j].id === memoId) {
            state.cards[i].memos.splice(j, 1);
          }
        }
      }
    },
    // idを付与してcardを新規作成
    addNewCard(state) {
      let cardIdMax = 0;
      for (let i = 0; i < state.cards.length; i++) {
        if (state.cards[i].id > cardIdMax) {
          cardIdMax = state.cards[i].id;
        }
      }
      // 新しいカードのid = 既存のカードのidの最大値 + 1
      const newCardId = cardIdMax + 1;
      state.cards.push({ id: newCardId, title: "", memos: [] });
    },
    // idを付与してmemoを新規作成
    addNewMemo(state, cardId) {
      let memoIdMax = 0;
      for (let i = 0; i < state.cards.length; i++) {
        for (let j = 0; j < state.cards[i].memos.length; j++) {
          if (state.cards[i].memos[j].id > memoIdMax) {
            memoIdMax = state.cards[i].memos[j].id;
          }
        }
      }
      // 新しいメモのid = 既存のメモのidの最大値 + 1
      const newMemoId = memoIdMax + 1;
      for (let i = 0; i < state.cards.length; i++) {
        if (state.cards[i].id === cardId) {
          state.cards[i].memos.push({ id: newMemoId, value: "" });
        }
      }
    },
  },
  actions: {
    // カードを削除
    deleteCard({ commit }, cardId) {
      commit("deleteCard", cardId);
    },
    // メモを削除
    deleteMemo({ commit }, memoId) {
      commit("deleteMemo", memoId);
    },
    // カードを追加
    addNewCard({ commit }) {
      commit("addNewCard");
    },
    // メモを追加
    addNewMemo({ commit }, cardId) {
      commit("addNewMemo", cardId);
    },
  },
  getters: {
    list: (state) => state.list,
  },
});
