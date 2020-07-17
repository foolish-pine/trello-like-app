<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";
import AppModule from "./store/modules/app";

@Component
export default class extends Vue {
  created() {
    firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        // ログイン後ユーザー情報とユーザーのカードをセットする
        AppModule.setLoginUserAction(user);
        AppModule.fetchCardsAction();
        this.$router.push("/cards", () => {});
      } else {
        AppModule.doLogoutAction();
        this.$router.push("/", () => {});
      }
    });
  }
}
</script>

<style lang="scss">
// Web Fontのちらつき対策
html {
  visibility: hidden;
}
html.wf-active,
html.loading-delay {
  visibility: visible;
}
</style>
