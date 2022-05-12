import React from 'react';
import styled from 'styled-components';
import Shimmer from 'components/Shimmer/Shimmer';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const FieldsLoadingSkelton = () => {
  const isMobile = DimensionHelper().isMobile;
  return (
    <>
      <Shimmer>
        <NodePageFieldSkeleton>
          <div className="titleContainer shimmerEffect">
            <TextStringSkeleton bold />
            <TextStringSkeleton length="short" bold />
          </div>
          {Array.apply(null, Array(isMobile ? 3 : 2)).map((_, key) => (
            <div className="nodeBlock" key={key}>
              <div className="shimmerEffect">
                <BlockSkeleton />
              </div>
              <div>
                <div className="titleContainer shimmerEffect">
                  <TextStringSkeleton length="short" />
                  <TextStringSkeleton />
                  {!isMobile && (
                    <>
                      <TextStringSkeleton length="short" />
                      <TextStringSkeleton className="text medium" />
                      <TextStringSkeleton length="long" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </NodePageFieldSkeleton>
      </Shimmer>
    </>
  );
};

export default FieldsLoadingSkelton;

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
