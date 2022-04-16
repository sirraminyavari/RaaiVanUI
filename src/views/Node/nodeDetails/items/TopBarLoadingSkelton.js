import React from 'react';
import styled from 'styled-components';
import Shimmer from 'components/Shimmer/Shimmer';

const LoadingSkelton = () => {
  return (
    <>
      <Shimmer>
        <NodePageHeaderSkeleton>
          <div className="headerContainer">
            <StackSkeletonWrapper>
              <BlockSkeleton width="25rem" aspectWidth="20" aspectHeight="2" />
            </StackSkeletonWrapper>
            <StackSkeletonWrapper justifyContent="end">
              <BlockSkeleton width="5rem" aspectWidth="7" aspectHeight="3" />
            </StackSkeletonWrapper>
          </div>
          <div className="headerContainer">
            <StackSkeletonWrapper>
              <BlockSkeleton width="4.5rem" />
              <BlockSkeleton width="20rem" aspectWidth="17" aspectHeight="2" />
            </StackSkeletonWrapper>
            <StackSkeletonWrapper justifyContent="end">
              <BlockSkeleton width="8rem" aspectWidth="3.5" aspectHeight="1" />
              <BlockSkeleton width="2.5rem" circle />
              <BlockSkeleton width="2.5rem" circle />
              <BlockSkeleton width="2.5rem" circle />
            </StackSkeletonWrapper>
          </div>
        </NodePageHeaderSkeleton>
      </Shimmer>
    </>
  );
};

export default LoadingSkelton;

const StackSkeletonWrapper = styled.div.attrs({
  className: 'shimmerEffect',
})`
  display: flex;
  align-items: center;
  ${({ alignItems = 'center' }) => `align-items: ${alignItems};`}
  ${({ justifyContent }) =>
    justifyContent && `justify-content: ${justifyContent};`}
  width: 100%;
  margin-block: 0.8rem;

  & > div {
    margin-inline-end: 0.4rem;
  }
`;
const NodePageHeaderSkeleton = styled.div`
  padding: 2rem;
  .headerContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    & > div {
      width: 40%;
    }
  }
`;
NodePageHeaderSkeleton.displayName = 'NodePageHeaderSkeleton';

const NodePageFieldSkeleton = styled.div`
  padding: 0px 2.5rem 2rem;
  .titleContainer {
    margin-block: 3rem;
  }

  .nodeBlock {
    margin-block: 2rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-shrink: 0;
    width: 100%;

    & > div:first-of-type {
      width: clamp(4rem, 30%, 12rem);
      margin-inline-end: clamp(0.5rem, 10%, 10rem);
    }
    & > div:last-of-type {
      width: clamp(5rem, 40%, 10rem);
    }
  }
`;
NodePageFieldSkeleton.displayName = 'NodePageFieldSkeleton';
const TextStringSkeleton = styled.div`
  height: 0.8rem;
  display: block;
  border-radius: 0.4rem;
  margin-block: 0.4rem;
  ${({ length }) => {
    switch (length) {
      case 'long':
        return `width: 100%;`;

      case 'short':
        return 'width: 30%;';

      default:
        return 'width: 60%;';
    }
  }}
  ${({ bold }) => bold && `height: 1.5rem;`}
`;

TextStringSkeleton.displayName = 'TextStringSkeleton';

const BlockSkeleton = styled.div`
  display: block;
  width: ${({ width }) => (width ? width : ' 100%')};
  aspect-ratio: ${({ aspectWidth = 2, aspectHeight = 1, circle }) =>
    circle ? `1/1` : `${aspectWidth}/${aspectHeight}`};
  border-radius: ${({ circle }) => (circle ? '100%' : '0.4rem')};
`;

BlockSkeleton.displayName = 'BlockSkeleton';
