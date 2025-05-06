import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/main.css';

import axios from 'axios';
import draggable from 'vuedraggable';


axios.defaults.baseURL = 'http://todo_backend.test/api';
axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('draggable', draggable);

app.mount('#app');
