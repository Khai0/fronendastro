<template>
  <div @click="handleClick">
    <slot />
  </div>
</template>

<script>
/*
* Accordion Vue component
* ---
* Wrapper component for children components with open() and close() methods.
* Allows 0 or 1 open children.
* Example usage:
*
* <vue-accordion>
*   <vue-collapsible>...</vue-collapsible>
*   <vue-collapsible>...</vue-collapsible>
*   <vue-collapsible>...</vue-collapsible>
* </vue-accordion>
*/

const itemAttributeLabel = 'accordion-item'

export default {
  mounted () {
    if (this.$children.length) {
      this.$children.forEach(function (child, i) {
        child.$el.setAttribute(itemAttributeLabel, i)
      })

      if (this.$children[0] && Object.prototype.hasOwnProperty.call(this.$children[0], 'open')) {
        this.$children[0].open()
      }
    }
  },

  methods: {
    handleClick (e) {
      const item = e.target.closest('[' + itemAttributeLabel + ']')
      if (item) {
        this.closeAll(item.getAttribute(itemAttributeLabel))
      }
    },

    closeAll (except) {
      this.$children.forEach(function (child, i) {
        if (i !== parseInt(except) && Object.prototype.hasOwnProperty.call(child, 'close')) {
          child.close()
        }
      })
    }
  }
}
</script>
