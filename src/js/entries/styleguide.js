/**
 * Styleguide Vue instance
 * ------------------------------------------------------------------------------
 * Separated style guide assets for performance.
 */

import '@/scss/styleguide.scss'

import Vue from 'vue'

// Filters
import '@/js/filters/currency'
import '@/js/filters/currencyFromCents'
import '@/js/filters/imageSize'

// Global components
import KeenSlider from '@/js/components/keen-slider.vue'
import ResponsiveImage from '@/js/components/responsive-image.vue'
import MaCode from '@/js/components/ma-code.vue'

Vue.component('ResponsiveImage', ResponsiveImage)

const initVueInstance = element => {
  return new Vue({
    el: element,

    delimiters: ['${', '}'],

    components: {
      KeenSlider,
      MaCode
    }
  })
}

document.querySelectorAll('[vue-init-styleguide]').forEach(element => {
  initVueInstance(element)
})
