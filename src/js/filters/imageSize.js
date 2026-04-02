/**
 * Returns a transformed image URL based on query parameters to mimic Liquid filter image_url
 * behaviour for images referenced with JS - https://shopify.dev/docs/api/liquid/filters/image_url.
 *
 * See allowed queries - https://shopify.dev/docs/api/liquid/filters/image_url#image_url-width
 *
 * @param {string} originalUrl URL of master image
 * @param {number} width
 * @param {number} height
 * @param {object} queries
 * @return {string} URL of resized image
 */

import Vue from 'vue'

import { updateUrlParameters } from '@/js/utils/helpers'

Vue.filter('imageSize', (originalUrl, width, height = null, queries = null) => {
  const params = {
    width: Math.ceil(width),
    height: Math.ceil(height),
    ...queries
  }

  if (!originalUrl.startsWith('https:')) {
    originalUrl = `https:${originalUrl}`
  }

  return updateUrlParameters(originalUrl, params)
})
