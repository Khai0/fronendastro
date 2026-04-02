<template>
  <div
    class="quantity"
    :class="styleModifier ? `quantity--${styleModifier}` : ''"
  >
    <button
      aria-label="Decrement quantity"
      class="quantity__button"
      type="button"
      @click="handleUpdateQuantity(quantity - 1)"
    >
      <span class="icon-minus" />
    </button>
    <input
      v-model="quantity"
      aria-label="Quantity"
      class="quantity__input"
      type="number"
      @input="handleQuantityInput"
    >
    <button
      aria-label="Increment quantity"
      class="quantity__button"
      type="button"
      @click="handleUpdateQuantity(quantity + 1)"
    >
      <span class="icon-plus" />
    </button>
  </div>
</template>

<script>
/*
* Quantity field Vue component
* ---
* Usage:
* <quantity-field
    :value="quantity"
    @update-quantity="handleQtyBtnClick"
  />
*/

import debounce from 'lodash-es/debounce'

export default {
  props: {
    value: {
      type: Number,
      default: 1
    },

    isZeroAllowed: {
      type: Boolean,
      default: false
    },

    styleModifier: {
      type: String,
      default: null
    }
  },

  emits: ['update-quantity'],

  data () {
    return {
      quantity: this.value
    }
  },

  watch: {
    value (value) {
      this.quantity = value
    }
  },

  methods: {
    handleUpdateQuantity (value) {
      let newQuantity = value !== undefined ? value : this.quantity
      if (newQuantity < 1 && !this.isZeroAllowed) {
        newQuantity = 1
        this.quantity = newQuantity
      } else if (newQuantity < 0) {
        newQuantity = 0
        this.quantity = newQuantity
      }
      this.$emit('update-quantity', newQuantity)
    },

    handleQuantityInput: debounce(function () {
      const newQuantity = parseInt(this.quantity)
      if (isNaN(newQuantity)) return
      // this.$emit('update-quantity', newQuantity)
      this.handleUpdateQuantity(newQuantity)
    }, 500)
  }
}
</script>
