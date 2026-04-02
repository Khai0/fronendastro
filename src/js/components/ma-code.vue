<template>
  <div class="relative">
    <div
      v-init-code
      class="code__render"
    >
      <slot />
    </div>
    <a
      href="javascript:"
      class="code__toggle"
      @click="isOpen = !isOpen"
    >
      {{ isOpen ? 'Hide' : 'Show' }} HTML
      <span>{{ isOpen ? '-' : '+' }}</span>
    </a>

    <collapse-transition>
      <div v-show="isOpen">
        <pre><code class="language-xml" /></pre>
      </div>
    </collapse-transition>
  </div>
</template>

<script>
/*
* Code Vue component
* ---
* Example usage:
*
* Single line
* <ma-code>...</ma-code>
*
* Multi line - Add <pre> to preserve line breaks and indents
* <ma-code>
*   <pre>...</pre>
* </ma-code>

* Liquid
* <ma-code raw-code="{% raw %}{{ liquid_var }}{% endraw %}">
*   ...
* </ma-code>
*/

import { CollapseTransition } from 'vue2-transitions'

import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/vs2015.css'

hljs.registerLanguage('xml', xml)

export default {
  components: {
    CollapseTransition
  },

  directives: {
    initCode: {
      inserted (el, binding, vnode) {
        if (vnode.context.rawCode) {
          el.parentNode.querySelector('code').innerText = vnode.context.rawCode
        } else {
          let pre = el.querySelector('pre')

          if (pre) { // If multi line i.e. wrapped in <pre>
            // First node would be spaces, assuming HTML is correctly indented
            const spaces = pre.childNodes[0].textContent
            pre = pre.innerHTML

            // Replace parent indents for display purposes
            if (/\s{2,}/.test(spaces)) {
              const regex = new RegExp(spaces, 'g')
              pre = pre.replace(regex, '')
            }

            el.innerHTML = pre
            el.parentNode.querySelector('code').textContent = pre.trim()
          } else {
            el.parentNode.querySelector('code').textContent = el.innerHTML.trim()
          }
        }
      }
    }
  },

  props: {
    rawCode: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      isOpen: false
    }
  },

  mounted () {
    hljs.highlightAll()
  }
}
</script>

<style lang="scss">
.code__render {
    max-width: calc(100% - 10em);
    margin-bottom: 1em;
}

.code__toggle {
    position: absolute;
    top: 0;
    right: 0;
}

pre {
    margin: 0;
    font-size: 1em;
    letter-spacing: .05em;
}
</style>
