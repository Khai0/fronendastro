module.exports = async ({ config }) => {
  try {
    const result = await transferFiles(config);
    return result;
  } catch (error) {
    throw new Error(`Transfer files failed: ${error.message}`);
  }
}

const transferFiles = async (config) => {
  const sourceStoreUrl = `https://${config.sourceStore}/admin/api/${config.apiVersion}/graphql.json`;
  const targetStoreUrl = `https://${config.targetStore}/admin/api/${config.apiVersion}/graphql.json`;

  // Get state of source/target stores
  const sourceStoreImages = await getImagesInStore(sourceStoreUrl, config.sourceStoreToken, config.daysAgo);
  const targetStoreImages = await getImagesInStore(targetStoreUrl, config.targetStoreToken, config.daysAgo);
  const missingNodes = findMissingNodes(sourceStoreImages, targetStoreImages);
  const mutationQueryInput = generateGraphQlInput(missingNodes);

  // Create files in target store
  let arrayOfResults = [];
  for (batch of mutationQueryInput) {
    const mutationFetchOptions = getShopifyGraphFetchOptions(IMAGES_GRAPH_MUTATION, config.targetStoreToken, batch);
    const res = await fetch(targetStoreUrl, mutationFetchOptions);
    if (!res.ok) {
      throw new Error(`Error calling Shopify endpoint to create images \ncode: ${res.status}\nreason: ${res.statusText}`)
    }
    const result = await res.json();
    arrayOfResults.push(result)
  }
  return arrayOfResults
}

const getImagesInStore = async (url, token, daysAgo) => {
  const searchDate = formatDateForGraphQL(daysAgo)
  let files = [];
  let hasNextPage = true;
  let queryVariables = {
    numFiles: 250,
    afterDate: `created_at:>${searchDate}`,
    cursor: null
  };

  do {
    const fetchOptions = getShopifyGraphFetchOptions(IMAGES_GRAPH_QUERY, token, queryVariables);
    const res = await fetch(url, fetchOptions)

    if (!res.ok) {
      throw new Error(`Error calling Shopify endpoint to fetch images \ncode: ${res.status}\nreason: ${res.statusText}`)
    }

    const graphqlRes = await res.json();

    if (graphqlRes.errors) {
      if (graphqlRes.errors[0].message === "Throttled") {
        const delayTime = Math.ceil(graphqlRes.extensions.cost.throttleStatus.currentlyAvailable / graphqlRes.extensions.cost.throttleStatus.restoreRate);
        console.log(`Maximum Graph Ql points exhausted, sleeping for ${delayTime} second/s...`);
        await delay(delayTime);
      }
    }

    if (graphqlRes.data) {
      console.log(`Number of images: ${graphqlRes.data.files.nodes.length}`);
      for (const imageNode of graphqlRes.data.files.nodes) {
        if (
          imageNode.image &&
          imageNode.image.originalSrc &&
          typeof imageNode.image.originalSrc === 'string' &&
          imageNode.image.originalSrc.trim().length > 0
        ) {
          files.push(imageNode);
        }
      }

      console.log(`Has a next page?: ${graphqlRes.data.files.pageInfo.hasNextPage}`);
      console.log(`Next Page is: ${graphqlRes.data.files.pageInfo.endCursor}`);

      hasNextPage = graphqlRes.data.files.pageInfo.hasNextPage;
      queryVariables.cursor = graphqlRes.data.files.pageInfo.endCursor;
    }

  } while (hasNextPage);

  return files
}

const getShopifyGraphFetchOptions = (query, accessToken, variables) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
      "X-Shopify-Access-Token": accessToken
    },
    body: JSON.stringify({
      query: query,
      variables: variables ? variables : undefined
    })
  }
}

const findMissingNodes = (sourceNodes, targetNodes) => {
  const urlFormattedNodes = targetNodes.map((node) => getFileName(node.image.originalSrc));
  const targetSrcSet = new Set(urlFormattedNodes);
  const missingNodes = sourceNodes.filter((node) => {
    const filename = getFileName(node.image.originalSrc);
    return !targetSrcSet.has(filename);
  });
  return missingNodes;
}

const getFileName = (fullUrl) => {
  const parsedUrl = new URL(fullUrl);
  return parsedUrl.pathname.split('/').pop();
};

const generateGraphQlInput = (nodes) => {
  const outputs = [];
  const chunkSize = 249;

  for (let i = 0; i < nodes.length; i += chunkSize) {
    const chunk = nodes.slice(i, i + chunkSize);
    const output = {
      files: chunk.map((node) => ({
        alt: "",
        duplicateResolutionMode: "RAISE_ERROR",
        contentType: "IMAGE",
        originalSource: node.image.originalSrc,
      })),
    };
    outputs.push(output);
  }
  return outputs;
};

const formatDateForGraphQL = (daysAgo) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysAgo);
  const year = currentDate.getUTCFullYear();
  const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getUTCDate().toString().padStart(2, '0');
  const hours = currentDate.getUTCHours().toString().padStart(2, '0');
  const minutes = currentDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getUTCSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const IMAGES_GRAPH_QUERY = `query ($numFiles: Int!, $cursor: String, $afterDate: String){
  files(first: $numFiles, after: $cursor, query: $afterDate) {
    nodes {
      ... on MediaImage {
          image {
            id
            originalSrc: url
            width
            height
          }
        }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

const IMAGES_GRAPH_MUTATION = `mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      id
      fileStatus
      createdAt
    }
    userErrors {
      field
      message
    }
  }
}`;
