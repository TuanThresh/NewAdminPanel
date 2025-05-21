import './assets/css/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createNotivue } from 'notivue'
import PageHeaderVue from './components/ui/PageHeader.vue';
import Icon from '@/components/ui/Icon.vue';
import 'notivue/notification.css'
import 'notivue/animations.css'

import App from './App.vue'
import router from './router'
const notivue = createNotivue({
    position: "bottom-right"
})
const app = createApp(App)
app.component('VueDatePicker', VueDatePicker);
app.component('PageHeader', PageHeaderVue);
app.component('Icon', Icon);
app.use(createPinia())
app.use(router)
app.use(notivue)
app.mount('#app')
