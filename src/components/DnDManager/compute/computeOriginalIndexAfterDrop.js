const computeOriginalIndexAfterDrop = (
  maxItems,
  sourceChunkIndex,
  destinationChunkIndex,
  indexInChunk
) => {
  return (
    destinationChunkIndex * maxItems +
    indexInChunk +
    (sourceChunkIndex < destinationChunkIndex ? -1 : 0)
  );
};

export default computeOriginalIndexAfterDrop;
