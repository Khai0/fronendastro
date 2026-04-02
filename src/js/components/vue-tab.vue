<template>
  <div
    v-show="isActive"
    v-if="isLoaded"
    :class="{ 'disabled': isDisabled }"
  >
    <slot />
  </div>
</template>

<script>
/*
* Tab Vue component
* ---
* Adapted from https://github.com/evseevdev/vue-simple-tabs
*
* Requires Tabs Vue component. See Tabs component for usage.
*
*/

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    active: {
      type: [Boolean, String],
      default: false
    },
    disabled: {
      type: [Boolean, String],
      default: false
    },
    dataAttrs: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      isActive: this.active,
      isDisabled: this.disabled,
      isLoaded: this.active
    }
  },

  computed: {
    index () {
      return this.$parent.tabList.indexOf(this)
    }
  },

  watch: {
    '$parent.activeTabIndex' (index) {
      this.isActive = this.index === index
      if (this.isActive) this.isLoaded = true
    },

    disabled () {
      this.isDisabled = this.disabled
    }
  },

  created () {
    this.$parent.tabList.push(this)
  }
}
</script>
