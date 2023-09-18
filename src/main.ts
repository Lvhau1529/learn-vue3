import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";
import "./style.css";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase";
// eslint-disable-next-line
const { Roulette } = require('vue3-roulette');
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const pinia = createPinia();

const app = createApp(App);

// import icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("Roulette", Roulette);

app.use(router);
app.use(ElementPlus);
app.use(pinia);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.mount("#app");
