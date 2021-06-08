const splitItems = (maxItems, items, createId) => {
  const slicedItems = sliceIntoItems(maxItems, items);
  return slicedItems.map(mapToChunk(createId));
};

export default splitItems;

function sliceIntoItems(maxItems, items) {
  const numberOfSlices = Math.ceil(items.length / maxItems);
  const sliceIndexes = Array.apply(null, Array(numberOfSlices)).map(
    (_, index) => index
  );
  return sliceIndexes.map((index) =>
    items.slice(index * maxItems, index * maxItems + maxItems)
  );
}

function mapToChunk(createId) {
  return function (items) {
    return {
      id: createId(),
      items,
    };
  };
}
