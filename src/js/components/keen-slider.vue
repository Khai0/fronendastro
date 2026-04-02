<template>
  <div class="relative">
    <div
      ref="slider"
      class="keen-slider"
      :class="classes"
    >
      <slot />
    </div>

    <template v-if="slider && hasArrows">
      <button
        aria-label="Previous"
        :class="{
          'keen-slider__arrow': true,
          'keen-slider__arrow--left': true,
          'keen-slider__arrow--disabled': current === 0,
        }"
        @click="slider.prev()"
      >
        <span class="icon-chevron-left" />
      </button>

      <button
        aria-label="Next"
        :class="{
          'keen-slider__arrow': true,
          'keen-slider__arrow--right': true,
          'keen-slider__arrow--disabled': current === 0,
        }"
        @click="slider.next()"
      >
        <span class="icon-chevron-right" />
      </button>
    </template>

    <div
      v-if="slider && hasPagination"
      class="keen-slider__pagination"
    >
      <button
        v-for="(_slide, idx) in dotHelper"
        :key="idx"
        :aria-label="'Go to slide ' + (idx + 1)"
        :class="{ 'dot': true, 'dot--active': current === idx }"
        @click="slider.moveToIdx(idx)"
      />
    </div>
  </div>
</template>

<script>
/*
* Keen Slider Vue component
* ---
* https://keen-slider.io/docs
*
* Example usage:
* <keen-slider
*   :arrows="true"
*   pagination="(max-width: 767px)"
*   :autoplay="3000"
*   :options="{
*     slides: {
*       perPage: 2,
*       spacing: 15
*     },
*     breakpoints: {
*       '(min-width: 768px)': {
*         slides: {
*           perView: 4,
*           spacing: 30
*         }
*       }
*     }
*   }"
* >...</keen-slider>
*/

import KeenSlider from 'keen-slider'

export default {
  props: {
    classes: {
      type: String,
      default: ''
    },

    options: {
      type: Object,
      default: () => {}
    },

    autoplay: {
      type: Number,
      default: 0
    },

    arrows: {
      type: [Boolean, String],
      default: false
    },

    pagination: {
      type: [Boolean, String],
      default: false
    }
  },

  data: () => ({
    slider: null,
    current: 0,
    hasArrows: false,
    hasPagination: false
  }),

  computed: {
    dotHelper () {
      return this.slider ? [...Array(this.slider.track.details.slides.length).keys()] : []
    }
  },

  mounted () {
    for (const slot of this.$slots.default) {
      slot.elm.classList.add('keen-slider__slide')
    }

    this.$nextTick(() => {
      this.slider = new KeenSlider(this.$refs.slider, {
        initial: this.current,
        loop: true,
        ...this.options,
        slideChanged: (s) => {
          this.current = s.track.details.rel
        }
      }, [
        this.autoSwitch
      ])

      if (typeof this.arrows === 'boolean') {
        this.hasArrows = this.arrows
      } else {
        const arrowMediaQuery = window.matchMedia(this.arrows)
        this.hasArrows = arrowMediaQuery.matches
        arrowMediaQuery.addEventListener('change', (mq) => {
          this.hasArrows = mq.matches
        })
      }

      if (typeof this.pagination === 'boolean') {
        this.hasPagination = this.pagination
      } else {
        const paginationMediaQuery = window.matchMedia(this.pagination)
        this.hasPagination = paginationMediaQuery.matches
        paginationMediaQuery.addEventListener('change', (mq) => {
          this.hasPagination = mq.matches
        })
      }
    })
  },

  beforeUnmount () {
    if (this.slider) this.slider.destroy()
  },

  methods: {
    autoSwitch (slider) {
      if (!this.autoplay) return false

      const wait = this.autoplay

      let timeout
      let mouseOver = false

      function clearNextTimeout () {
        clearTimeout(timeout)
      }

      function nextTimeout () {
        clearTimeout(timeout)
        if (mouseOver) return

        timeout = setTimeout(() => {
          slider.next()
        }, wait)
      }

      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })

      slider.on('dragStarted', clearNextTimeout)
      slider.on('animationEnded', nextTimeout)
      slider.on('updated', nextTimeout)
    }
  }

}

</script>
