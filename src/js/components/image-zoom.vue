<template>
  <div
    class="zoom-on-hover"
    @mousemove="move"
    @mouseover="move"
    @mouseenter="zoom"
    @mouseleave="unzoom"
  >
    <img
      ref="normal"
      :alt="alt"
      class="normal"
      :loading="isLazyLoad ? 'lazy' : false"
      :width="width"
      :height="height"
      :src="imgNormal"
      :srcset="`${imgMobile} 767w, ${imgNormal} 1024w`"
    >
    <img
      ref="zoom"
      :alt="alt"
      class="zoom"
      loading="lazy"
      :src="imgZoom"
      :srcset="`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg== 767w, ${imgZoom}`"
    >
  </div>
</template>

<script>
/*
* Image Zoom Vue component
* ---
* Adapted from https://github.com/Intera/vue-zoom-on-hover
* Default zoom will be the image's true size
*
* Example usage:
* <image-zoom img-normal="{{ image | image_url: width: 1024 }}" img-zoom="{{ image | image_url: width: 2048 }}"></image-zoom>
*/

function pageOffset (el) {
  // -> {x: number, y: number}
  // get the left and top offset of a dom block element
  const rect = el.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return {
    y: rect.top + scrollTop,
    x: rect.left + scrollLeft
  }
}

export default {
  props: {
    imgMobile: {
      type: String,
      required: true
    },
    imgNormal: {
      type: String,
      required: true
    },
    imgZoom: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: null
    },
    scale: {
      type: Number,
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLazyLoad: {
      type: Boolean,
      default: true
    },
    alt: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      scaleFactor: 1,
      resizeCheckInterval: null
    }
  },

  mounted () {
    if (this.scale) {
      this.scaleFactor = parseFloat(this.scale)
      this.$refs.zoom.style.transform = 'scale(' + this.scaleFactor + ')'
    }
    this._initEventLoaded()
    this._initEventResized()
  },

  updated () {
    this._initEventLoaded()
  },

  beforeDestroy () {
    this.resizeCheckInterval && clearInterval(this.resizeCheckInterval)
  },

  methods: {
    zoom () {
      if (this.isDisabled) return
      this.$refs.zoom.style.display = 'block'
      // this.$refs.zoom.style.opacity = 1
      // this.$refs.normal.style.opacity = 0
    },

    unzoom () {
      if (this.isDisabled) return
      this.$refs.zoom.style.display = 'none'
      // this.$refs.zoom.style.opacity = 0
      // this.$refs.normal.style.opacity = 1
    },

    move (e) {
      if (this.isDisabled) return
      const offset = pageOffset(this.$el)
      const zoom = this.$refs.zoom
      const normal = this.$refs.normal
      const relativeX = e.clientX - offset.x + window.pageXOffset
      const relativeY = e.clientY - offset.y + window.pageYOffset
      const normalFactorX = relativeX / normal.offsetWidth
      const normalFactorY = relativeY / normal.offsetHeight
      const x = normalFactorX * (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth)
      const y = normalFactorY * (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight)
      zoom.style.left = -x + 'px'
      zoom.style.top = -y + 'px'
    },

    _initEventLoaded () {
      // emit the "loaded" event if all images have been loaded
      const promises = [this.$refs.zoom, this.$refs.normal].map((image) => {
        return new Promise((resolve, reject) => {
          image.addEventListener('load', resolve)
          image.addEventListener('error', reject)
        })
      })
      const component = this
      Promise.all(promises).then(() => {
        component.$emit('loaded')
      })
    },

    _initEventResized () {
      const normal = this.$refs.normal
      let previousWidth = normal.offsetWidth
      let previousHeight = normal.offsetHeight
      const component = this
      this.resizeCheckInterval = setInterval(() => {
        if ((previousWidth !== normal.offsetWidth) || (previousHeight !== normal.offsetHeight)) {
          previousWidth = normal.offsetWidth
          previousHeight = normal.offsetHeight
          component.$emit('resized', {
            width: normal.width,
            height: normal.height,
            fullWidth: normal.naturalWidth,
            fullHeight: normal.naturalHeight
          })
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.zoom-on-hover {
  position: relative;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    pointer-events: none;
  }

  .normal {
    width: 100%;
  }

  .zoom {
    position: absolute;
    max-width: unset;
    min-width: 100%;
    display: none;
    transform-origin: top left;
  }
}
</style>
