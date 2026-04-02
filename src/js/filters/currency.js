import Vue from 'vue'
import { i18n } from '../vendors/vue-i18n'

Vue.filter('currency', value => {
  return i18n.n(value, 'currency')
})
