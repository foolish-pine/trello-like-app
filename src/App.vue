<template>
  <v-app>
    <header>
      <v-app-bar app flat dark class="teal" height="80">
        <v-toolbar-title v-if="uid" class="app-title">My Memo Board.</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-if="uid" key="login" class="d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <img :src="photoURL" />
          </v-avatar>
          <div class="mr-5">{{ displayName }}</div>
          <v-btn @click="doLogout" outlined>ログアウト</v-btn>
        </div>
      </v-app-bar>
    </header>
    <router-view />
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";
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
        this.doLogout(user);
        this.$router.push("/", () => {});
      }
    });
  },
  methods: {
    ...mapActions(["setLoginUser", "doLogin", "doLogout", "fetchCards"])
  },
  computed: {
    ...mapGetters(["uid", "displayName", "photoURL"])
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");
.app-title {
  font-family: "Lobster", cursive;
  font-size: 2.5rem !important;
}
</style>
