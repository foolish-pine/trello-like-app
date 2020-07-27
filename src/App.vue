<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as firebase from "firebase/app";
import "firebase/auth";
import AppModule from "./store/modules/app";

@Component
export default class extends Vue {
  created() {
    firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        // ログイン後ユーザー情報とユーザーのカードをセットする
        AppModule.setLoginUserAction(user);
        this.$router.push({ name: "cards" }, () => {});
      } else {
        this.$router.push({ name: "login" }, () => {});
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
