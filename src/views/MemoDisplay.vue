<template>
  <v-content class="teal">
    <v-container class="d-flex">
      <!-- カードを存在するだけ並べる -->
      <draggable
        group="cardGroup"
        animation="200"
        v-model="$store.state.cards"
        @end="updateCardOrder"
        class="d-flex"
        style="height: 100%"
      >
        <v-card
          v-for="(card, cardIndex) in $store.state.cards"
          :key="card.id"
          width="300px"
          height="100%"
          class="mr-5 pb-3 grey lighten-3 card"
          :id="card.id"
        >
          <v-system-bar window class="px-0">
            <v-spacer></v-spacer>
            <v-icon @click="deleteCard(card.id)">mdi-close</v-icon>
          </v-system-bar>
          <v-textarea
            :value="card.cardName"
            @change="editCardName(card.id, $event)"
            solo
            auto-grow
            flat
            dense
            rows="1"
            background-color="grey lighten-3"
            class="px-3 py-2 title"
          ></v-textarea>
          <div class="px-3">
            <!-- メモを表示する -->
            <draggable
              group="memoGroup"
              animation="200"
              v-model="card.memos"
              @end="updateMemoOrder"
              :id="cardIndex"
            >
              <div v-for="(memo, memoIndex) in card.memos" :key="memoIndex">
                <v-hover v-slot:default="{ hover }">
                  <v-card height="100%" class="d-flex mb-3">
                    <v-textarea
                      :value="memo.value"
                      @change="editMemoValue(card.id, cardIndex, memoIndex, $event)"
                      solo
                      auto-grow
                      flat
                      dense
                      rows="1"
                    ></v-textarea>
                    <v-icon
                      v-show="hover? true : false"
                      @click="deleteMemo(card.id, cardIndex, memoIndex)"
                      class="pr-1 memo-close-icon"
                    >mdi-close</v-icon>
                  </v-card>
                </v-hover>
              </div>
            </draggable>
            <!-- メモ追加ボタン -->
            <v-hover v-slot:default="{ hover }">
              <v-card
                flat
                class="add-button"
                :class="{ 'on-hover': hover }"
                @click="addNewMemo(card.id, cardIndex)"
              >
                <v-card-title class="px-3 py-2 body-1">
                  <v-icon class="mr-2">mdi-plus</v-icon>Add New Memo
                </v-card-title>
              </v-card>
            </v-hover>
          </div>
        </v-card>
      </draggable>
      <v-hover v-slot:default="{ hover }">
        <v-card
          min-width="300px"
          height="100%"
          class="mr-5 px-3 py-3 card add-button"
          :class="{ 'on-hover': hover }"
          @click="addNewCard()"
        >
          <v-card-title class="px-3 py-0 title">
            <v-icon class="mr-2">mdi-plus</v-icon>Add New Card
          </v-card-title>
        </v-card>
      </v-hover>
    </v-container>
  </v-content>
</template>

<script>
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  name: "MemoDisplay",
  components: {
    draggable
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["uid", "cards"])
  },
  methods: {
    // カードを追加
    addNewCard() {
      // 新しいカードのindex = 既存のカードのindexの最大値 + 1
      let cardIndexMax = 0;
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].index > cardIndexMax) {
          cardIndexMax = this.cards[i].index;
        }
      }
      const newCardIndex = parseInt(cardIndexMax) + 1;
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc()
        .set({ index: newCardIndex, cardName: "", memos: [] });
    },
    // カードを削除
    deleteCard(cardId) {
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .onSnapshot(snapshot => {
          snapshot.forEach(doc => {
            if (doc.id === cardId) {
              firebase
                .firestore()
                .collection(`users/${this.uid}/cards`)
                .doc(doc.id)
                .delete();
            }
          });
        });
    },
    // カード名を編集
    editCardName(cardId, event) {
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(cardId)
        .update({
          cardName: event
        });
    },
    // カード入れ替え時にカードのindexを更新する
    updateCardOrder(event) {
      for (let i = 0; i < event.from.children.length; i++) {
        firebase
          .firestore()
          .collection(`users/${this.uid}/cards`)
          .doc(event.from.children[i].id)
          .update({ index: i });
      }
    },
    // メモを追加
    addNewMemo(cardId, cardIndex) {
      // カードのすべてのメモを取得し、配列に入れる
      const targetCardMemos = this.cards[cardIndex].memos.slice(
        0,
        this.cards[cardIndex].memos.length
      );
      // その配列の最後にメモを追加する
      targetCardMemos.push({ value: "" });
      // メモ追加後の配列をJSON形式でfirebaseに保存
      const modifiedCardMemos = JSON.parse(
        JSON.stringify(targetCardMemos, null, 2)
      );
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(cardId)
        .update({ memos: modifiedCardMemos });
    },
    // メモを削除
    deleteMemo(cardId, cardIndex, memoIndex) {
      // カードのすべてのメモを取得し、配列に入れる
      const targetCardMemos = this.cards[cardIndex].memos.slice(
        0,
        this.cards[cardIndex].memos.length
      );
      // その配列から、削除ボタンが押されたメモを削除する
      targetCardMemos.splice(memoIndex, 1);
      // メモ削除後の配列をJSON形式でfirebaseに保存
      const modifiedCardMemos = JSON.parse(
        JSON.stringify(targetCardMemos, null, 2)
      );
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(cardId)
        .update({ memos: modifiedCardMemos });
    },
    // メモを編集
    editMemoValue(cardId, cardIndex, memoIndex, event) {
      // カードのすべてのメモを取得し、配列に入れる
      const targetCardMemos = this.cards[cardIndex].memos.slice(
        0,
        this.cards[cardIndex].memos.length
      );
      // 配列から編集したいメモを選択し、テキストエリアに入力した文字列をそのvalueに代入
      targetCardMemos[memoIndex].value = event;
      // メモ編集後の配列をJSON形式でfirebaseに保存
      const modifiedCardMemos = JSON.parse(
        JSON.stringify(targetCardMemos, null, 2)
      );
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(cardId)
        .update({ memos: modifiedCardMemos });
    },
    // メモ移動後、移動元、移動先のメモ一覧をfirebaseに保存
    updateMemoOrder(event) {
      // メモ移動後、移動元のカードのメモ一覧をfirebaseに保存
      const fromCardMemos = JSON.parse(
        JSON.stringify(this.cards[event.from.id].memos, null, 2)
      );
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(this.cards[event.from.id].id)
        .update({ memos: fromCardMemos });
      // メモ移動後、移動先のカードのメモ一覧をfirebaseに保存
      const toCardMemos = JSON.parse(
        JSON.stringify(this.cards[event.to.id].memos, null, 2)
      );
      firebase
        .firestore()
        .collection(`users/${this.uid}/cards`)
        .doc(this.cards[event.to.id].id)
        .update({ memos: toCardMemos });
    }
  }
};
</script>

<style lang="scss">
.v-content {
  overflow: auto !important;
}
.v-content__wrap {
  max-width: none !important;
}
.container {
  max-width: none !important;
}
.card-container {
  height: 100%;
}
.card {
  cursor: pointer;
}
.v-text-field__details {
  display: none !important;
}
.v-text-field__slot {
  cursor: pointer;
}
textarea {
  padding-right: 10px !important;
  cursor: pointer;
}
.add-button {
  background-color: #eeeeee !important;

  &.on-hover {
    background-color: #e0e0e0 !important;
  }
}
.card-close-icon {
  position: absolute !important;
  top: 5px;
  right: 0;
  z-index: 10;
  background-color: #eee;
}
.memo-close-icon {
  font-size: 20px !important;
  position: absolute !important;
  top: 9px;
  right: 3px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>