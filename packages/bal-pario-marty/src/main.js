import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";

import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

import "./assets/main.css";

Vue.use(PiniaVuePlugin);
Vue.use(Buefy);

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
}).$mount("#app");
