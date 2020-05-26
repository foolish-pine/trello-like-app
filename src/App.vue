<template>
  <v-app>
    <header>
      <v-app-bar app flat dark class="teal" height="80">
        <v-toolbar-title
          class="headline font-weight-bold"
        >My Memo Board
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="uid" key="login" class="d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <img :src="photoURL" />
          </v-avatar>
          <v-btn color="white" @click="doLogout" outlined>ログアウト</v-btn>
        </div>
        <div v-else key="logout">
          <v-btn color="white" @click="doLogin" outlined>ログイン</v-btn>
        </div>
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
