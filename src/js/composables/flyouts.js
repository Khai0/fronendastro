/**
 * Flyouts Vue composable
 * ------------------------------------------------------------------------------
 * Handle menus and other global flyouts.
 */

import Vue, { reactive, ref, watch } from 'vue'

import { insertAfter } from '@/js/utils/helpers'

const flyouts = reactive({
  menu: false,
  minicart: false,
  search: false,
  megamenuToggles: {}
})

const megamenuToggles = reactive({})
const megamenuCloseTimers = {}

const scrollLock = {
  menu: true,
  minicart: false,
  search: false
}

export function useFlyouts () {
  const scrollPosition = ref(0)

  function clearMegamenuCloseTimer (parent) {
    if (megamenuCloseTimers[parent]) {
      window.clearTimeout(megamenuCloseTimers[parent])
      delete megamenuCloseTimers[parent]
    }
  }

  function toggleFlyout (item) {
    for (const flyout in flyouts) {
      flyouts[flyout] = flyout === item
        ? !flyouts[flyout]
        : false
    }
  }

  function initMegamenu (el, binding) {
    const dropdown = document.querySelector(`[parent-item="${binding.value}"]`)

    if (dropdown) {
      Vue.set(megamenuToggles, binding.value, false)
      const headerInner = el.closest('.site-header__inner')

      if (headerInner) {
        headerInner.appendChild(dropdown)
      } else {
        insertAfter(dropdown, el)
      }

      if (!dropdown.dataset.megamenuHoverBound) {
        dropdown.addEventListener('mouseenter', () => {
          openMegamenu(binding.value)
        })

        dropdown.dataset.megamenuHoverBound = 'true'
      }

      el.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
          e.preventDefault()
          toggleMegamenu(binding.value)
        }
      })
    } else {
      const arrow = el.querySelector('.menu-arrow')
      if (arrow) arrow.remove()
    }
  }

  function toggleMegamenu (parent) {
    if (!parent.includes('__')) { // If top level menu item
      for (const menu in megamenuToggles) {
        if (menu !== parent) { megamenuToggles[menu] = false }
      }
    }

    megamenuToggles[parent] = !megamenuToggles[parent]
  }

  function openMegamenu (parent) {
    if (window.matchMedia('(max-width: 1023px)').matches) return

    clearMegamenuCloseTimer(parent)

    if (!parent.includes('__')) { // If top level menu item
      for (const menu in megamenuToggles) {
        if (menu !== parent) { megamenuToggles[menu] = false }
      }
    }

    megamenuToggles[parent] = true
  }

  function scheduleMegamenuClose (parent, delay = 220) {
    if (window.matchMedia('(max-width: 1023px)').matches) return

    clearMegamenuCloseTimer(parent)

    megamenuCloseTimers[parent] = window.setTimeout(() => {
      megamenuToggles[parent] = false
      delete megamenuCloseTimers[parent]
    }, delay)
  }

  function closeAllMegamenus () {
    for (const parent in megamenuCloseTimers) {
      clearMegamenuCloseTimer(parent)
    }

    for (const menu in megamenuToggles) {
      megamenuToggles[menu] = false
    }
  }

  watch(flyouts, (state) => {
    closeAllMegamenus()

    const activeFlyout = Object.keys(state).find(key => state[key] === true)
    if (!activeFlyout || !scrollLock[activeFlyout]) {
      document.body.classList.remove('no-scroll')
      document.body.style.top = ''
      if (scrollPosition.value) window.scrollTo(0, scrollPosition.value)
      return
    }

    scrollPosition.value = window.pageYOffset

    document.body.classList.add('no-scroll')
    document.body.style.top = `-${scrollPosition.value}px`
  })

  return {
    flyouts,
    megamenuToggles,
    toggleFlyout,
    initMegamenu,
    toggleMegamenu,
    openMegamenu,
    scheduleMegamenuClose,
    closeAllMegamenus
  }
}
