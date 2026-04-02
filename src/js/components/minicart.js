import { useCart } from '@/js/composables/cart'
import { useFlyouts } from '@/js/composables/flyouts'

export default {
  setup () {
    const {
      cart,
      isLoading,
      error,
      publicProperties,
      updateItem
    } = useCart()

    const {
      flyouts,
      toggleFlyout
    } = useFlyouts()

    return {
      cart,
      isLoading,
      error,
      publicProperties,
      updateItem,
      flyouts,
      toggleFlyout
    }
  }
}
