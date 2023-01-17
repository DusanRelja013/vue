import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import VueSmoothScroll from 'vue3-smooth-scroll'
import axios from 'axios'
import VueAxios from 'vue-axios'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { languages } from '@/lang/index.js'

const messages = Object.assign(languages)

const i18n = createI18n({
  locale: Config.DEFAULT_LOCALE_LANGUAGE,
  fallbackLocale: 'en',
  messages,
  legacy: false,
  globalInjection: true,
})

import App from './App.vue'
import router from './router'
import {Config} from "@/config";

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(VueAxios, axios)
app.use(VueSmoothScroll)
app.use(router)

app.mount('#app')
