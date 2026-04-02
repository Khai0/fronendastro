/**
 * Get offset of element relative to document.
 *
 * @param {element} el
 * @return {Object} The top and left offset of the element relative to the document
 */
export function getElementOffset (el) {
  let top = 0
  let left = 0
  let element = el

  // Loop through the DOM tree
  // and add it's parent's offset to get page offset
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element)

  return {
    top,
    left
  }
}

/**
 * Remove the specified parameter from the current URL.
 *
 * @param {string} name
 */
export function removeParameterFromUrl (name) {
  const url = window.location.href
  let newUrl = url.split('?')[0]
  let param
  let params = []
  const queryString = (url.indexOf('?') !== -1) ? url.split('?')[1] : ''

  if (queryString !== '') {
    params = queryString.split('&')
    for (let i = params.length - 1; i >= 0; i -= 1) {
      param = params[i].split('=')[0]
      if (param === name) {
        params.splice(i, 1)
      }
    }
    if (params.length) {
      newUrl = newUrl + '?' + params.join('&')
    }
  }

  window.history.replaceState({ path: newUrl }, '', newUrl)
}

/**
 * Taken from @shopify/theme-product-form - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-product-form
 * Returns a URL with a variant ID query parameter. Useful for updating window.history
 * with a new URL based on the currently select product variant.
 * @param {string} url - The URL you wish to append the variant ID to
 * @param {number} id  - The variant ID you wish to append to the URL
 * @returns {string} - The new url which includes the variant ID query parameter
 */
export function getUrlWithVariant (url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, '$1' + id)
  } else if (/\?/.test(url)) {
    return url.concat('&variant=').concat(id)
  }

  return url.concat('?variant=').concat(id)
}

/**
 * Returns URL with query string based on key, value params.
 */
export function updateUrlParameters (originalUrl, params) {
  const url = new URL(originalUrl.toString())

  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, value.toString())
    }
  }

  return url.toString()
}

export function setContentHeight () {
  const headerElement = document.querySelector('.header')
  const announcementBarElement = document.querySelector('.announcement-bar')
  const announcementBarElementHeight = announcementBarElement ? Math.max(announcementBarElement.clientHeight + announcementBarElement.getBoundingClientRect().top, 0) : 0
  const headerBottomPosition = announcementBarElementHeight + headerElement.offsetHeight
  document.querySelector(':root').style.setProperty('--content-height', window.innerHeight - headerBottomPosition + 'px')
}

export function insertAfter (newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}
