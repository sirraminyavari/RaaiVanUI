import React from 'react';
import splitItems from './compute/splitItems';
import computeOriginalIndex from './compute/computeOriginalIndex';
import computeOriginalIndexAfterDrop from './compute/computeOriginalIndexAfterDrop';

const withMaxItems = (Component, createId) => {
  return class ComponentWithMaxItems extends React.Component {
    constructor(props) {
      super(props);
      const maxItems =
        props.maxItems && props.maxItems > 0
          ? props.maxItems
          : props.items.length;
      this.state = {
        maxItems,
        items: props.items,
        chunks: splitItems(maxItems, props.items, createId),
      };
    }

    findChunkIndex = (id) => {
      return this.state.chunks.findIndex((chunk) => chunk.id === id);
    };

    onDragEnd = ({ source, destination }) => {
      if (destination) {
        const { index: indexInSourceChunk, id: sourceChunkId } = source;
        const {
          index: indexInDestinationChunk,
          id: destinationChunkId,
        } = destination;
        const sourceChunkIndex = this.findChunkIndex(sourceChunkId);
        const destinationChunkIndex = this.findChunkIndex(destinationChunkId);
        const sourceIndex = computeOriginalIndex(
          this.state.maxItems,
          sourceChunkIndex,
          indexInSourceChunk
        );
        const destinationIndex = computeOriginalIndexAfterDrop(
          this.state.maxItems,
          sourceChunkIndex,
          destinationChunkIndex,
          indexInDestinationChunk
        );
        this.props.onDragEnd(sourceIndex, destinationIndex);
      }
    };

    render = () => {
      const { items, maxItems, onDragEnd, ...rest } = this.props;
      return (
        <Component
          chunks={this.state.chunks}
          onDragEnd={this.onDragEnd}
          {...rest}
        />
      );
    };
  };
};

export default withMaxItems;
