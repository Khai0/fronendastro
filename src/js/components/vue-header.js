import { setContentHeight } from '@/js/utils/helpers'

import { useCart } from '@/js/composables/cart'
import { useFlyouts } from '@/js/composables/flyouts'

import Minicart from '@/js/components/minicart'
import HeaderSearch from '@/js/components/header-search'

export default {
  components: {
    Minicart,
    HeaderSearch
  },

  setup () {
    const {
      cart
    } = useCart()

    const {
      flyouts,
      megamenuToggles,
      toggleFlyout,
      initMegamenu,
      closeAllMegamenus
    } = useFlyouts()

    return {
      cart,
      flyouts,
      megamenuToggles,
      toggleFlyout,
      initMegamenu,
      closeAllMegamenus
    }
  },

  directives: {
    initMegamenu: {
      inserted (el, binding, vnode) {
        vnode.context.initMegamenu(el, binding, vnode)
      }
    }
  },

  mounted () {
    // Hide content until header has loaded
    document.querySelector('body').classList.remove('hidden')

    // Fix for iOS Safari 100vh issue
    setContentHeight()
    window.addEventListener('resize', () => setContentHeight())
  }
}
