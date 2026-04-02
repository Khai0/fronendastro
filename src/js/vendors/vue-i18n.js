import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const numberFormats = {
  'en-AU': {
    currency: {
      style: 'currency',
      currency: 'AUD'
    }
  }
}

export const i18n = new VueI18n({
  locale: 'en-AU',
  fallbackLocale: 'en-AU',
  numberFormats
})
