<template>
  <img
    class="block"
    :loading="isLazyLoad ? 'lazy' : false"
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :alt="alt"
    :width="Math.ceil(baseWidth)"
    :height="Math.ceil(baseHeight)"
  >
</template>

<script>
/*
* Responsive Image Vue component
* ---
* Example usage:
*
* <responsive-image
*   :src="product.media[0].src"
*   :base-width="500"
*   :base-height="500 / product.media[0].aspect_ratio"
*   :alt="product.media[0].alt || product.title"
*   class="block">
* </responsive-image>
*/

export default {
  props: {
    src: {
      type: String,
      required: true
    },

    alt: {
      type: String,
      default: ''
    },

    baseWidth: {
      type: Number,
      default: null
    },

    baseHeight: {
      type: Number,
      default: null
    },

    isLazyLoad: {
      type: Boolean,
      default: true
    },

    // Learn how sizes work - https://www.dofactory.com/html/img/sizes
    sizes: {
      type: String,
      default: 'auto'
    }
  },

  data () {
    return {
      srcsetWidths: [
        352,
        832,
        1200,
        1920
      ]
    }
  },

  computed: {
    srcset () {
      const width = this.srcsetWidths.map(width => `${this.$options.filters.imageSize(this.src, width)} ${width}w`)
      return width.join(', ')
    }
  },

  created () {
    if (this.baseWidth) {
      this.srcsetWidths = [
        Math.ceil(this.baseWidth * 0.5),
        Math.ceil(this.baseWidth * 0.75),
        this.baseWidth,
        Math.ceil(this.baseWidth * 1.5),
        Math.ceil(this.baseWidth * 2)
      ]
    }
  },

  methods: {

  }
}
</script>
