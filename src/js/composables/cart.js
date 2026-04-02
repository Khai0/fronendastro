import { ref, onMounted } from 'vue'
import axios from 'axios'

import { xhrRequestConfig } from '@/js/utils/api'

const cart = ref(null)
const isLoading = ref(false)

export function useCart () {
  const isAddingToCart = ref(false)
  const error = ref(null)

  onMounted(() => {
    if (!cart.value && !isLoading.value) fetchCart()
  })

  function publicProperties (item) {
    if (!item.properties) return {}
    return Object.fromEntries(Object.entries(item.properties).filter(([key]) => key.substring(0, 1) !== '_'))
  }

  function addToCart (variantId, quantity = 1, properties) {
    error.value = null
    if (!variantId) {
      error.value = 'No variant selected.'
      return
    }

    isAddingToCart.value = true

    const data = {
      quantity,
      id: variantId
    }

    if (properties) {
      data.properties = properties
    }

    const root = window.Shopify?.routes?.root || '/'
    console.log('Posting to Shopify Cart API:', `${root}cart/add.js`, data)
    return axios.post(`${root}cart/add.js`, data, xhrRequestConfig).then(async (response) => {
      console.log('Add to cart response:', response.data)
      await fetchCart()
      return { success: true }
    }).catch(({ response, request, message }) => {
      if (response) {
        console.error('addToCart response error:', response.data)
        const { data } = response
        error.value = data.description || data.message
      } else if (request) {
        console.error('addToCart request error (no response):', request)
      } else {
        console.error('addToCart unknown error:', message)
      }
      return { success: false }
    }).finally(() => {
      isAddingToCart.value = false
    })
  }

  function updateItem (item, quantity, properties) {
    error.value = null
    isLoading.value = true
    item.isLoading = true

    const cartItems = cart.value?.items || []
    const itemIndex = cartItems.indexOf(item)
    if (itemIndex !== -1) cartItems.splice(itemIndex, 1, item)

    const data = {
      id: item.key,
      quantity
    }

    if (properties) {
      data.properties = properties
    }

    // Avoid the cart/update.js request as it does not valide the quantity of variants
    // already in the cart - https://mindarc.gyazo.com/cdd2a46a2787924e3565e1523a4db08c
    const root = window.Shopify?.routes?.root || '/'
    axios.post(`${root}cart/change.js`, data, xhrRequestConfig)
      .then(async () => {
        await fetchCart()
      }).catch(async ({ response, request, message }) => {
        if (response) {
          // Fetch cart to set the item's latest available maximum quantity
          // note: product order may reshuffle so we have to find the item again via key property
          const oldItemKey = item.key

          await fetchCart()

          const newItem = cart.value?.items?.find(item => item.key === oldItemKey)
          const newItemIndex = cart.value?.items?.indexOf(newItem)
          if (newItem && newItemIndex !== -1) {
            newItem.message = response.data.message
            cart.value.items.splice(newItemIndex, 1, newItem)
          }
        } else if (request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest
          console.log('request error', request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('unknown error', message)
        }
      }).finally(() => {
        isLoading.value = false
        item.isLoading = false
      })
  }

  async function fetchCart () {
    isLoading.value = true

    const root = window.Shopify?.routes?.root || '/'
    await axios.get(`${root}cart?view=data`).then(({ data }) => {
      cart.value = data
    }).catch(error => {
      console.error('fetchCart error:', error.toJSON())
    })

    isLoading.value = false
  }

  return {
    cart,
    isLoading,
    isAddingToCart,
    error,

    publicProperties,
    addToCart,
    updateItem,
    fetchCart
  }
}
