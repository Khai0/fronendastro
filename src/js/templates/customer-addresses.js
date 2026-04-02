import Vue from 'vue'
import { CollapseTransition } from 'vue2-transitions'

// Utility to localise address forms specific to Shopify.
// https://github.com/Shopify/theme-scripts/blob/master/packages/theme-addresses/README.md
import { AddressForm } from '@shopify/theme-addresses'

export default {
  components: {
    CollapseTransition
  },

  data () {
    return {
      isNewAddressFormShown: false,
      addressToggles: []
    }
  },

  mounted () {
    AddressForm(this.$refs.newAddress, 'en')

    if (this.$refs.addressCount) {
      for (let i = 0; i < parseInt(this.$refs.addressCount.value); i++) {
        AddressForm(this.$refs[`address${i}`], 'en')
        Vue.set(this.addressToggles, i, false)
      }
    }
  },

  methods: {
    toggleNewAddressForm () {
      this.isNewAddressFormShown = !this.isNewAddressFormShown
    },

    toggleAddressForm (index) {
      Vue.set(this.addressToggles, index, !this.addressToggles[index])
    },

    deleteAddress (event) {
      const confirmMessage = event.target.getAttribute('data-confirm-message')

      if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        event.preventDefault()
      }
    }
  }
}
