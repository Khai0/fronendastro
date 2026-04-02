/**
 * Product Vue composable
 * ------------------------------------------------------------------------------
 * Product form and common product functionality that is not specific to a view.
 */

import { ref, computed, onMounted, watch } from 'vue'
import isEqual from 'lodash-es/isEqual'

import { getProductOptions } from '@/js/utils/data'

export function useProduct (product, collectionUrl) {
  const currentVariant = ref(product.variants && product.variants.length > 0 ? product.variants[0] : null)
  const quantity = ref(1)
  const selectedOptions = ref([])

  const productOptions = getProductOptions(product)
  const baseUrl = `${collectionUrl || ''}/products/`
  const isSale = computed(() => (currentVariant.value?.compare_at_price > currentVariant.value?.price) || (product?.compare_at_price > product?.price))

  onMounted(() => {
    _initSelectedOptions()
  })

  watch(currentVariant, (value) => {
    if (value && !isEqual(value.options, selectedOptions.value)) {
      selectedOptions.value = [...value.options]
    }
  })

  // function swatchUrl (colour) {
  //   return `${app.fileUrl}colour-${colour}.jpg`.replace(/\s+/g, '-')
  // }

  function updateVariant () {
    const variant = product.variants.find(variant => isEqual(variant.options, selectedOptions.value))
    currentVariant.value = variant || null
  }

  function _initSelectedOptions () {
    if (currentVariant.value) {
      selectedOptions.value = [...currentVariant.value.options]
    } else {
      selectedOptions.value = product.options.map(() => '')
    }
  }

  function updateOption (index, value) {
    selectedOptions.value.splice(index, 1, value)
    updateVariant()
  }

  return {
    currentVariant,
    quantity,
    productOptions,
    selectedOptions,
    baseUrl,
    isSale,

    updateVariant,
    updateOption
  }
}
