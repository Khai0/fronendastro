<template>
  <button
    type="submit"
    class="button"
    :disabled="isLoading"
  >
    <slot v-if="!isLoading" />
    <span
      v-else
      class="spinner"
    >{{ loadingLabel }}</span>
  </button>
</template>

<script>
/*
 * Button Spinner Vue component
 * ---
 * Example usage:
 *
 * <button-spinner :is-loading="isSubmitting" loading-label="Submitting..." class="button button--primary">
 *   <span>Submit</span>
 * </button-spinner>
 */

export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    loadingLabel: {
      type: String,
      default: 'Loading'
    }
  }
}
</script>
