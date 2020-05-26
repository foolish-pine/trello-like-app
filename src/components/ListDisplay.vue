<template>
  <v-content class="teal">
    <v-container class="d-flex">
        <draggable class="d-flex card-container" v-for="card in $store.state.cards" :key="card" :options="{group: 'cardGroup', animation: 200}">
          <v-card width="300px" class="mr-5 pb-3 px-3 grey lighten-3">
            <v-card-title class="px-4 pb-3">{{ card.title }}</v-card-title>
            <draggable v-model="card.contents" :options="{group: 'itemGroup', animation: 200}">
              <v-card v-for="item in card.contents" :key="item" class="mb-3">
                <v-card-title class="px-3 py-1">{{ item }}</v-card-title>
              </v-card>
            </draggable>
          </v-card>
        </draggable>
    </v-container>
  </v-content>
</template>

<script>
import draggable from "vuedraggable";
import { mapGetters } from "vuex";

export default {
  components: {
    draggable
  },
  data: () => ({}),
  computed: {
    ...mapGetters(["list"])
  }
};
</script>

<style lang="scss">
.memo-card {
  cursor: pointer;
}
.card-container {
  height: 100%;
}
</style>