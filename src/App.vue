<template>
  <v-app>
    <header>
      <v-app-bar app flat dark class="teal" height="80">
        <v-toolbar-title
          class="app-title"
        >My Memo Board.
        </v-toolbar-title>
        <v-spacer></v-spacer>
        
      </v-app-bar>
    </header>
    <ListDisplay></ListDisplay>
  </v-app>
</template>

<script>
import ListDisplay from "./components/ListDisplay";

export default {
  components: {
    ListDisplay
  },
  data: () => ({})
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
.app-title {
font-family: 'Lobster', cursive;
font-size: 2.5rem !important;
}
</style>
