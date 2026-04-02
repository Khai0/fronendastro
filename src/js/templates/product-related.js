/**
 * Product Related Vue component
 * ------------------------------------------------------------------------------
 * Main template in sections/product__related.liquid
 *
 * Recommended products retrieved via Product Recommendations Ajax API
 * https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations
 *
 * Example usage:
 * <product-related inline-template product-id="{{ product.id }}"/>
 */

import axios from 'axios'
import Cookies from 'js-cookie'

import VueTabs from '@/js/components/vue-tabs.vue'
import VueTab from '@/js/components/vue-tab.vue'
import KeenSlider from '@/js/components/keen-slider.vue'
import ProductItem from '@/js/components/product-item.js'

import { storefrontRequestConfig } from '@/js/utils/api'
import { productQuery, transformGraphqlProduct, transformAjaxProduct } from '@/js/utils/data'

const COOKIE_RECENTLY_VIEWED = 'recently_viewed'

export default {
  components: {
    KeenSlider,
    VueTabs,
    VueTab,
    ProductItem
  },

  props: {
    productId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      isLoading: true,
      recommendedProducts: [],
      recentlyViewedProducts: [],
      sliderOptions: {
        slides: {
          perView: 2,
          spacing: 30
        },
        breakpoints: {
          '(min-width: 768px)': {
            slides: {
              perView: 4,
              spacing: 30
            }
          }
        }
      }
    }
  },

  async created () {
    // Recommended products
    const recommendedPromise = this._getRecommendedProducts()

    // Recently viewed products
    let recentPromise = []
    if (Cookies.get(COOKIE_RECENTLY_VIEWED)) {
      const recentlyViewed = JSON.parse(Cookies.get(COOKIE_RECENTLY_VIEWED))

      if (!recentlyViewed.includes(this.productId)) {
        Cookies.set(COOKIE_RECENTLY_VIEWED, JSON.stringify([this.productId, ...recentlyViewed]), { expires: 7 })
      }

      recentPromise = this._getRecentlyViewedProducts(recentlyViewed.slice(0, 6))
    } else {
      Cookies.set(COOKIE_RECENTLY_VIEWED, JSON.stringify([this.productId]), { expires: 7 })
    }

    // Needs to be initialised in this order so that the tab order is correct
    await Promise.all([recommendedPromise, recentPromise]).then(data => {
      this.recommendedProducts = data[0]
      this.recentlyViewedProducts = data[1]
    }).catch(error => {
      console.log(error)
    })

    this.isLoading = false
  },

  methods: {
    _getRecentlyViewedProducts (productIds) {
      const graphqlIds = productIds.reduce((filtered, id) => {
        if (id !== this.productId) {
          filtered.push('"' + btoa('gid://shopify/Product/' + id) + '"')
        }
        return filtered
      }, [])

      const data = `{
        nodes(ids: [${graphqlIds}]) {
          id
          ... on Product {
            ${productQuery}
          }
        }
      }`

      // eslint-disable-next-line no-undef
      return axios.post(`https://${Shopify.shop}/api/2022-10/graphql.json`, data, storefrontRequestConfig).then(({ data }) => {
        // Remove products that aren't available to Storefront API
        const products = data.data.nodes.filter(node => node)

        return products.map(product => transformGraphqlProduct(product))
      }).catch((error) => {
        console.log('Pecently viewed products', error)
        throw error
      })
    },

    _getRecommendedProducts () {
      return axios.get(`/recommendations/products.json?product_id=${this.productId}`).then(({ data }) => {
        return data.products.map(product => transformAjaxProduct(product))
      }).catch((error) => {
        console.log('Recommended products', error)
        throw error
      })
    }
  }
}
