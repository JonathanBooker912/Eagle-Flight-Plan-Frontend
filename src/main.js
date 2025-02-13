import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import vuetify from "./plugins/vuetify.js";
import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(mdiVue, { icons: mdijs });
app.mount("#app");
