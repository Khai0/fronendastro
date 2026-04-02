import Vue from 'vue'
import { i18n } from '../vendors/vue-i18n'

Vue.filter('currencyFromCents', value => {
  return i18n.n(value / 100, 'currency')
})
