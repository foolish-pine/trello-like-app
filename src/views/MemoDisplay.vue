<template>
  <v-content :style="themeColor">
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
            @change="editCardName({cardId: card.id, value: $event})"
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
                      @change="editMemoValue({cardId: card.id, cardIndex: cardIndex, memoIndex: memoIndex, value: $event})"
                      solo
                      auto-grow
                      flat
                      dense
                      rows="1"
                    ></v-textarea>
                    <v-icon
                      v-show="hover? true : false"
                      @click="deleteMemo({cardId: card.id, cardIndex: cardIndex, memoIndex: memoIndex})"
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
                @click="addNewMemo({cardId: card.id, cardIndex: cardIndex})"
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
          @click="addNewCard"
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
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";
import store from "../store";

export default {
  name: "MemoDisplay",
  components: {
    draggable
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["uid", "cards"]),
    themeColor() {
      return `background-color: ${store.state.themeColor} !important`;
    }
  },
  methods: {
    ...mapActions([
      "addNewCard",
      "deleteCard",
      "editCardName",
      "updateCardOrder",
      "addNewMemo",
      "deleteMemo",
      "editMemoValue",
      "updateMemoOrder"
    ])
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
// .themeColor {
//   background-color: #334433 !important;
// }
</style>