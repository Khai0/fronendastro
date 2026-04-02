<template>
  <div class="tabs">
    <ul
      class="tabs__nav"
      :class="navClasses"
    >
      <li
        v-for="(tab, index) in tabList"
        v-bind="tab.dataAttrs"
        :key="index"
        :class="{'tabs__tab--active': activeTabIndex === index, 'tabs__tab--disabled': tab.disabled}"
        class="tabs__tab"
        @click="select(index)"
      >
        <a
          href="javascript:"
          class="tabs__link"
          :class="{'tabs__link--active': activeTabIndex === index, 'tabs__link--disabled': tab.disabled}"
        >{{ tab.title }}</a>
      </li>
    </ul>
    <div class="tabs__content">
      <slot />
    </div>
  </div>
</template>

<script>
/*
* Tabs Vue component
* ---
* Adapted from https://github.com/evseevdev/vue-simple-tabs
*
* Example usage:
* <vue-tabs nav-classes="mb-5">
*   <vue-tab title="{{ 'products.product.related_products' | t }}">
*     <product-related product-id="{{ product.id }}" :translations='{{ translation_data }}'/>
*   </vue-tab>
*
*   <vue-tab title="{{ 'products.product.recently_viewed' | t }}">
*     <product-recently-viewed product-id="{{ product.id }}" :translations='{{ translation_data }}'/>
*   </vue-tab>
* </vue-tabs>
*/

export default {
  props: {
    navClasses: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      tabList: [],
      activeTabIndex: -1
    }
  },

  mounted () {
    this.activeTabIndex = this.getInitialActiveTab()
  },

  methods: {
    select (index) {
      const tab = this.tabList[index]
      if (!tab.isDisabled) {
        this.activeTabIndex = index
      }

      this.$emit('changed', tab)
    },

    getInitialActiveTab () {
      const index = this.tabList.findIndex(tab => tab.active)
      return index === -1 ? 0 : index
    }
  }
}
</script>
