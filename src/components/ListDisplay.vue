<template>
  <v-content class="teal">
    <v-container class="d-flex">
      <!-- カードを存在するだけ並べる -->
      <draggable
        v-for="card in $store.state.cards"
        :key="card.id"
        :options="{group: 'cardGroup', animation: 200}"
        class="d-flex card-container"
      >
        <v-card width="300px" class="mr-5 pb-3 grey lighten-3 card">
          <v-system-bar window class="px-0">
            <v-spacer></v-spacer>
            <v-icon @click="deleteCardMethod(card.id)">mdi-close</v-icon>
          </v-system-bar>
          <v-textarea
            :value="card.title"
            solo
            auto-grow
            flat
            dense
            rows="1"
            background-color="grey lighten-3"
            class="px-3 py-2 title"
          ></v-textarea>
          <div class="px-3">
            <!-- メモを存在するだけ並べる -->
            <draggable v-model="card.memos" :options="{group: 'memoGroup', animation: 200}">
              <v-hover v-for="memo in card.memos" :key="memo.id" v-slot:default="{ hover }">
                <v-card height="100%" class="d-flex mb-3">
                  <v-textarea :value="memo.value" solo auto-grow flat dense rows="1"></v-textarea>
                  <v-icon
                    v-show="hover? true : false"
                    @click="deleteMemoMethod(memo.id)"
                    class="pr-1 memo-close-icon"
                  >mdi-close</v-icon>
                </v-card>
              </v-hover>
            </draggable>
            <v-hover v-slot:default="{ hover }">
              <v-card
                flat
                class="add-button"
                :class="{ 'on-hover': hover }"
                @click="addNewMemoMethod(card.id)"
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
          @click="addNewCardMethod()"
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
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: {
    draggable
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["list"])
  },
  methods: {
    ...mapActions(["deleteCard", "deleteMemo", "addNewCard", "addNewMemo"]),
    deleteCardMethod(cardId) {
      this.deleteCard(cardId);
    },
    deleteMemoMethod(memoId) {
      this.deleteMemo(memoId);
    },
    addNewCardMethod() {
      this.addNewCard();
    },
    addNewMemoMethod(cardId) {
      this.addNewMemo(cardId);
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