/**
 * Product Item Vue Component
 * ------------------------------------------------------------------------------
 * Main template in snippets/product-item.liquid
 */

import { useProduct } from '@/js/composables/product'
import { useCart } from '@/js/composables/cart'
import { useFlyouts } from '@/js/composables/flyouts'

export default {
  props: {
    product: {
      type: Object,
      required: true
    },

    // Liquid only data e.g. filtered variant media
    featuredMedia: {
      type: Object
    },

    // Liquid only data e.g. filtered variant and search analytics queries
    url: {
      type: String
    },

    isLazyLoad: {
      type: Boolean,
      default: true
    },

    /**
     * Passed to the responsive image component.
     * Learn how sizes work - https://www.dofactory.com/html/img/sizes
     *
     * Example:
     * img-sizes="(max-width: 767px) 50vw, (max-width: 1440px) 20vw, calc(1440px / 5)"
     * - Container width is 1440px
     * - On desktop, product image is 1/5 or 20% wide within a container
     * - On mobile, there are 2 product images per row
     */
    imgSizes: {
      type: String,
      default: 'auto'
    }
  },

  setup (props) {
    const {
      currentVariant,
      quantity,
      productOptions,
      selectedOptions,
      baseUrl,
      isSale,
      updateVariant
    } = useProduct(props.product)

    const {
      isLoading: isCartLoading,
      isAddingToCart,
      error: cartError,
      addToCart
    } = useCart()

    const {
      toggleFlyout
    } = useFlyouts()

    return {
      currentVariant,
      quantity,
      productOptions,
      selectedOptions,
      baseUrl,
      isSale,
      updateVariant,

      isCartLoading,
      isAddingToCart,
      cartError,
      addToCart,

      toggleFlyout
    }
  },

  data () {
    return {
      media: null
    }
  },

  computed: {
    productUrl () {
      return `${this.baseUrl}${this.product.handle}`
    }
  },

  created () {
    if (this.product.variants.length === 1) {
      this.currentVariant = this.product.variants[0]
    }

    this.media = this.featuredMedia || this.product.media?.[0]
  },

  methods: {
    async handleAddToCart () {
      const { success } = await this.addToCart(this.currentVariant.id, this.quantity)
      if (success) this.toggleFlyout('minicart')
    }
  }
}
