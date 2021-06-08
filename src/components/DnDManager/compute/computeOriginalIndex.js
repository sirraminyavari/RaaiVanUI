const computeOriginalIndex = (maxItems, chunkIndex, indexInChunk) => {
  return chunkIndex * maxItems + indexInChunk;
};

export default computeOriginalIndex;
