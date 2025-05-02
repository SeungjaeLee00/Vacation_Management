/* 

Vue 3, Vue CLI 기반 프로젝트

 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');