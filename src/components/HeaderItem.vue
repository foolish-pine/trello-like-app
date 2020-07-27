<template>
  <v-app-bar app flat dark :color="themeColor" height="80">
    <v-toolbar-title class="app-title hidden-xs-only">My Memo Board.</v-toolbar-title>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
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
              <v-color-picker v-model="colorpicker"></v-color-picker>
            </v-menu>
          </v-list-item>
          <v-list-item v-for="color in colors" :key="color.index">
            <v-icon :color="color" class="mdi-36px" @click="pickColor(color)">mdi-circle</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-avatar v-if="photoURL" size="40" class="mr-3">
        <img :src="photoURL" />
      </v-avatar>
      <div v-if="displayName" class="mr-5">{{ displayName }}</div>
      <div v-else class="mr-8">ゲストさん</div>
      <v-btn @click="doLogout" outlined>ログアウト</v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Debounce } from "vue-debounce-decorator";
import AppModule from "../store/modules/app";

@Component
export default class HeaderItem extends Vue {
  colorpicker: string = this.themeColor;

  get user() {
    return AppModule.user;
  }

  get uid(): string {
    return AppModule.uid;
  }

  get displayName(): string | null {
    return AppModule.displayName;
  }

  get photoURL(): string | null {
    return AppModule.photoURL;
  }

  get colors(): {
    [s: string]: string;
  } {
    return AppModule.colors;
  }

  get themeColor(): string {
    return AppModule.themeColor;
  }

  @Watch("themeColor")
  themeColorChanged(themeColor: string) {
    this.colorpicker = themeColor;
  }

  @Debounce(200)
  @Watch("colorpicker")
  colorPickerChange(pickedColor: string) {
    AppModule.setThemeColorAction(pickedColor);
  }

  pickColor(color: string) {
    AppModule.setThemeColorAction(color);
  }

  doLogout() {
    AppModule.doLogoutAction();
  }
}
</script>

<style lang="scss" scoped>
.app-title {
  font-family: "Lobster", cursive;
  font-size: 2.5rem !important;
}
</style>
