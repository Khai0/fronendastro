<template>
  <div>
    <div v-if="isEnabled">
      <div
        class="content"
        :style="{ height: height + 'px' }"
      >
        <slot />
      </div>
      <a
        v-if="!isReadingMore"
        href="javascript:"
        @click="readMore"
      >read more</a>
      <a
        v-else
        href="javascript:"
        @click="readLess"
      >read less</a>
    </div>
    <slot v-else />
  </div>
</template>

<script>
/*
* Code component
* ---
* Example usage:
*
* <read-more class="rte" :less-height="42">
*     {{ product.description }}
* </read-more>
*/

export default {
  props: {
    lessHeight: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      isEnabled: false,
      isReadingMore: false,
      originalHeight: null,
      height: 0
    }
  },

  mounted () {
    this.originalHeight = this.$el.offsetHeight

    if (this.originalHeight > this.lessHeight) {
      this.readLess()
      this.isEnabled = true
    }
  },

  methods: {
    readMore () {
      this.isReadingMore = true
      this.height = this.originalHeight
    },

    readLess () {
      this.isReadingMore = false
      this.height = this.lessHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
    margin-bottom: 5px;
    overflow: hidden;
    transition: height .3s ease-in-out;
}

a {
    text-decoration: underline;
}
</style>
