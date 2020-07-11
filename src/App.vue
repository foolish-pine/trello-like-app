<template>
  <v-app>
    <header>
      <v-app-bar v-if="uid" app flat dark :color="$store.state.themeColor" height="80">
        <v-toolbar-title class="app-title hidden-xs-only">My Memo Board.</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-if="uid" class="d-flex align-center">
          <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-icon class="mr-5" v-on="on">mdi-dots-horizontal</v-icon>
            </template>
            <v-list>
              <v-list-item>
                <v-menu :close-on-content-click="false" transition="slide-y-transition">
                  <template v-slot:activator="{ on }">
                    <v-icon class="mdi-36px" v-on="on">mdi-eyedropper-plus</v-icon>
                  </template>
                  <v-color-picker v-model="pickedColor"></v-color-picker>
                </v-menu>
              </v-list-item>
              <v-list-item v-for="color in $store.state.colors" :key="color.index">
                <v-icon
                  :color="color"
                  class="mdi-36px"
                  @click="setThemeColor(color)"
                >mdi-circle</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-avatar v-if="photoURL" size="40" class="mr-3">
            <img :src="photoURL" />
          </v-avatar>
          <div v-if="displayName" class="mr-5">{{ displayName }}</div>
          <div v-if="$store.state.user.isAnonymous" class="mr-8">ゲストさん</div>
          <v-btn @click="doLogout" outlined>ログアウト</v-btn>
        </div>
      </v-app-bar>
    </header>
    <router-view />
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import store from "./store";
import firebase from "firebase";

export default {
  data: () => ({}),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // ログイン後ユーザー情報とユーザーのカードをセットする
        this.setLoginUser(user);
        this.fetchCards();
      } else {
        this.doLogout();
        this.$router.push("/", () => {});
      }
    });
  },
  methods: {
    ...mapActions([
      "setLoginUser",
      "doLogin",
      "doLogout",
      "fetchCards",
      "setThemeColor",
    ]),
  },
  computed: {
    ...mapGetters(["uid", "displayName", "photoURL"]),
    pickedColor: {
      get() {
        return store.state.themeColor;
      },
      set(color) {
        this.setThemeColor(color);
      }
    }
  }
};
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
.app-title {
  font-family: "Lobster", cursive;
  font-size: 2.5rem !important;
}
</style>
