<template>
  <v-content class="teal">
    <v-container text-center justify-center>
      <h1 class="app-title mb-5">My Memo Board.</h1>
      <div v-if="!uid" class="align-center mb-5">
        <v-btn @click="doAnonymousLogin" large color="white" class="black--text">匿名でログイン</v-btn>
      </div>
      <div v-if="!uid" class="align-center">
        <v-btn @click="doLogin" large color="white" class="black--text">Googleアカウントでログイン</v-btn>
      </div>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import firebase from "firebase";

export default {
  name: "Home",
  components: {},
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/memo", () => {});
      }
    });
  },
  methods: {
    ...mapActions(["doLogin", "doAnonymousLogin" ,"setLoginUser"])
  },
  computed: {
    ...mapGetters(["uid"])
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 4rem !important;
  text-align: center;
  color: #fff;
}
.fv {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
}
</style>