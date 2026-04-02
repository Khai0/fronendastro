/**
 * Search Bar Vue Component
 * ------------------------------------------------------------------------------
 * Template in snippets/header-search.liquid
 *
 */

import axios from 'axios'
import debounce from 'lodash-es/debounce'

import { useFlyouts } from '@/js/composables/flyouts'

export default {
  props: {
    defaultValue: {
      type: String,
      default: null
    }
  },

  setup () {
    const {
      flyouts,
      toggleFlyout
    } = useFlyouts()

    return {
      flyouts,
      toggleFlyout
    }
  },

  data () {
    return {
      isSearchLoading: false,
      search: this.defaultValue,
      results: []
    }
  },

  watch: { // Debounce and watchers - https://vuejs.org/v2/guide/computed.html#Watchers
    search (value) {
      if (value) {
        this.performSearch()
      } else {
        this.results = []
      }
    },

    flyouts: {
      handler (value) {
        if (value.search) {
          this.$nextTick(() => {
            this.$refs.search.focus()
          })

          if (this.search && !this.results.length) this.performSearch()
        }
      },
      deep: true
    }
  },

  methods: {
    performSearch: debounce(async function () {
      this.isSearchLoading = true

      if (this.search) {
        // Predictive Search API - https://shopify.dev/docs/themes/ajax-api/reference/predictive-search
        await axios.get(`/search/suggest.json?q=${this.search}&resources[type]=product&resources[limit]=8`).then(({ data }) => {
          this.results = data.resources.results.products
        }).catch((error) => {
          console.log(error)
        })
      }

      this.isSearchLoading = false
    }, 500)
  }
}
