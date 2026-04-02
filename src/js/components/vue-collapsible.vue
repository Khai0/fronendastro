<template>
  <div
    class="collapsible"
    :class="{ 'collapsible--active': isActive }"
  >
    <div
      class="collapsible__title"
      :class="{ 'flex items-center justify-between': !isDisabled }"
      @click="toggle()"
    >
      <div><slot name="title" /></div>
      <div
        v-if="!isDisabled"
        class="collapsible__toggle"
        :class="{ 'collapsible__toggle--active': isActive, 'md:hidden': isDesktopDisabled }"
      />
    </div>
    <collapse-transition>
      <div
        v-show="isActive"
        :class="{ 'md:block': isDesktopDisabled }"
      >
        <div class="collapsible__content">
          <slot />
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
/*
* Collapsible Vue component
* ---
* Example usage:
*
* <vue-collapsible>
*   <template v-slot:title>Accordion Title</template>
*   <template>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</template>
* </vue-collapsible>
*/

import { CollapseTransition } from 'vue2-transitions'

export default {
  components: {
    CollapseTransition
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },

    isDisabled: {
      type: Boolean,
      default: false
    },

    isDesktopDisabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isActive: this.isOpen
    }
  },

  created () {
    if (this.isDisabled) {
      this.isActive = true
    }
  },

  methods: {
    toggle () {
      if (this.isDisabled) return
      this.isActive = !this.isActive
    },

    close () {
      if (this.isDisabled) return
      this.isActive = false
    },

    open () {
      if (this.isDisabled) return
      this.isActive = true
    }
  }
}
</script>
