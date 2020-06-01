import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import MemoDisplay from "../views/MemoDisplay.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/memo",
    name: "memo",
    component: MemoDisplay,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
