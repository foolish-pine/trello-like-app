<template>
  <v-content class="teal">
    <v-container text-center justify-center>
      <h1 class="app-title mb-5">My Memo Board.</h1>
      <template v-if="!uid">
        <div class="align-center mb-5">
          <v-btn @click="doAnonymousLogin" large color="white" class="black--text">匿名でログイン</v-btn>
        </div>
        <div class="align-center">
          <v-btn @click="doLogin" large color="white" class="black--text">Googleアカウントでログイン</v-btn>
        </div>
      </template>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppModule from "../store/modules/app";

@Component
export default class Home extends Vue {
  get uid(): string {
    return AppModule.uid;
  }

  doLogin() {
    AppModule.doLoginAction();
  }

  doAnonymousLogin() {
    AppModule.doAnonymousLoginAction();
  }
}
</script>

<style lang="scss" scoped>
.fv {
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding: 0;
}
.app-title {
  font-family: "Lobster", cursive;
  font-size: 4rem !important;
  text-align: center;
  color: #fff;
}
</style>