import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NewSpendingViewVue from "@/views/NewSpendingView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/new", component: NewSpendingViewVue },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
