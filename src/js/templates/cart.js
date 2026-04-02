import { useCart } from '@/js/composables/cart'

export default {
  setup () {
    const {
      cart,
      isLoading,
      publicProperties,
      updateItem
    } = useCart()

    return {
      cart,
      isLoading,
      publicProperties,
      updateItem
    }
  }
}
