import { createApp } from 'vue'
import App from './App.vue'

// Import Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// Create Vuetify instance
const vuetify = createVuetify()

// Create and mount the app
createApp(App).use(vuetify).mount('#app')
