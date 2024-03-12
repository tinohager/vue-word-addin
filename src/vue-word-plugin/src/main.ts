import { createApp } from 'vue'
import App from './App.vue'

Office.onReady(() => {
  createApp(App).mount('#app')
})
