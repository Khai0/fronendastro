/**
 * Standard product GraphQL query
 */
export const productQuery = `
  id
  title
  handle
  tags
  productType
  options {
    name,
    values
  }
  images(first: 2) {
    edges {
      node {
        altText
        url
      }
    }
  }
  priceRange {
    maxVariantPrice {
      amount
    }
    minVariantPrice {
      amount
    }
  }
  variants(first: 250) {
    edges {
      node {
        id
        availableForSale
        selectedOptions {
          value
        }
        compareAtPrice {
          amount
        }
      }
    }
  }
`

/**
 * The products loaded from graphQL need to be edited to
 * - name variables to match liquid versions
 * - set URL correctly
 * - fix IDs with atob()
 * - set pricing correctly
 */
export function transformGraphqlProduct (productNode, collectionHandle = null) {
  return productNode
    ? {
        objectType: 'product',
        handle: productNode.handle,
        url: collectionHandle ? `/collections/${collectionHandle}/products/${productNode.handle}` : `/products/${productNode.handle}`,
        id: parseInt(productNode.id.replace('gid://shopify/Product/', '')),
        tags: productNode.tags.map(tag => tag.toLowerCase()),
        productType: productNode.productType,
        title: productNode.title,
        variants: productNode.variants.edges.map(({ node }) => {
          return {
            id: parseInt(node.id.replace('gid://shopify/ProductVariant/', '')),
            available: node.availableForSale,
            compare_at_price: node.compareAtPrice?.amount * 100 || null,
            options: node.selectedOptions.map(option => option.value)
          }
        }),
        price: productNode.priceRange.minVariantPrice.amount * 100,
        compare_at_price: productNode.variants.edges[0].node.compareAtPrice?.amount * 100 || null,
        media: productNode.images.edges.map(image => {
          return {
            alt: image.node.altText,
            media_type: 'image',
            src: image.node.url
          }
        }),
        has_only_default_variant: productNode.options[0].values[0] === 'Default Title',
        options: productNode.options.map(option => option.name),
        options_with_values: productNode.options.map(option => {
          return {
            name: option.name,
            position: productNode.options.indexOf(option) + 1,
            values: option.values
          }
        })
      }
    : null
}

/**
 * The products loaded from Shopify Product Ajax API need to be edited to
 * - conform to Liquid Project object
 */
export function transformAjaxProduct (product) {
  product.has_only_default_variant = product.options[0].values[0] === 'Default Title'
  product.options_with_values = product.options
  product.options = product.options.map(option => option.name)
  return product
}

/**
 * Liquid Product object JSON does not have options_with_values property,
 * so we need to build this ourselves.
 * @param {Object} product
 * @returns {Array} array of objects - options with values
 */
export function getProductOptions (product) {
  if (product.options_with_values) {
    return product.options_with_values
  } else {
    const optionsWithValues = []

    if (product.variants[0].title !== 'Default Title') {
      for (const [index, option] of Object.entries(product.options)) {
        const position = parseInt(index) + 1
        const values = new Set() // Use Set to collect unqiue values

        for (const variant of product.variants) {
          values.add(variant[`option${position}`])
        }

        const optionWithValues = {
          name: option,
          position,
          values: [...values]
        }

        optionsWithValues.push(optionWithValues)
      }
    }

    return optionsWithValues
  }
}
