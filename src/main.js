import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import firebase from "firebase";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAjNIc4ojZcHOwDj77h2qCgeoD4i_rx2FQ",
  authDomain: "trello-like-app-2f587.firebaseapp.com",
  databaseURL: "https://trello-like-app-2f587.firebaseio.com",
  projectId: "trello-like-app-2f587",
  storageBucket: "trello-like-app-2f587.appspot.com",
  messagingSenderId: "59248206498",
  appId: "1:59248206498:web:e3bd38ba825ee40f57edfb",
  measurementId: "G-ZVJEX9QV5F",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
