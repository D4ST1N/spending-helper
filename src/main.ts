import { createApp } from "vue";
import { setupCalendar } from "v-calendar";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import vuetify from "@/plugins/vuetify";
import i18n from "@/plugins/i18n";
import router from "@/router";
import App from "@/App.vue";

import "moment/dist/locale/uk";

import "./style.css";
import "v-calendar/style.css";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(pinia);
app.use(setupCalendar, {});

app.mount("#app");
