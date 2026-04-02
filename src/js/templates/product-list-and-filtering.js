/**
 * Collection Vue Component
 * ------------------------------------------------------------------------------
 * Template in sections/collection.liquid
 *
 * Sort functionality:
 * Using hidden input for sort field to concentrate filtering <form> to required
 * elements only, to avoid nested forms (product forms).
 */

import ProductItem from '@/js/components/product-item.js'
import VueCollapsible from '@/js/components/vue-collapsible.vue'

export default {
  components: {
    ProductItem,
    VueCollapsible
  },

  props: {
    defaultSort: {
      type: String,
      default: 'manual'
    }
  },

  data () {
    return {
      isLoading: false,
      sortBy: this.defaultSort
    }
  },

  methods: {
    submitFilters () {
      this.$nextTick(() => this.$refs.filtersForm.submit())
      this.isLoading = true
    }
  }
}
