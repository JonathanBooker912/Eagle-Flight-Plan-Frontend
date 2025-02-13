import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import vuetify from "./plugins/vuetify.js";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(vuetify);
app.use(pinia);

const store = userStore();
await store.setupStore();

app.mount("#app");
