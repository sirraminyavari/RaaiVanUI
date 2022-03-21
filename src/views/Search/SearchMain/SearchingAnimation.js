import React from 'react';
import Shimmer from 'components/Shimmer/Shimmer';
import Avatar from 'components/Avatar/Avatar';
import styled from 'styled-components';
import { CV_DISTANT } from 'constant/CssVariables';

const SearchingAnimation = (props) => {
  const emptyImage =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  return (
    <>
      {Array.apply(null, Array(4)).map((_, key) => (
        <Shimmer key={key}>
          <SearchSkeleton>
            <AvatarContainer>
              <Avatar url={emptyImage} className="Avatar" />
              <span className="text" />
            </AvatarContainer>
            <VerticalLine>
              <div />
            </VerticalLine>
            <TextContainer>
              <span className="text short" />
              <span className="text long" />
              <span className="text long" />
              <span className="text long" />
            </TextContainer>
          </SearchSkeleton>
        </Shimmer>
      ))}
    </>
  );
};

export default SearchingAnimation;

const SearchSkeleton = styled.div`
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.45rem;
  width: calc(100% - 1rem);
  margin: 0.6rem 0;
  padding: 0.3rem;
  display: flex;
  box-sizing: border-box;
`;

const TextContainer = styled.div.attrs({ className: 'shimmerEffect' })`
  width: 100%;
  padding-block: 1rem;
  padding-inline: 1rem;

  .text {
    height: 0.8rem;
    display: inline-block;
    border-radius: 0.45rem;

    &.long {
      width: 100%;
    }
    &.short {
      width: 30%;
    }
  }
`;

const AvatarContainer = styled.div.attrs({ className: 'shimmerEffect' })`
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > .Avatar {
    width: 3rem;
    height: 3rem;
    margin-block-end: 0.5rem;
  }

  .text {
    height: 0.6rem;
    display: inline-block;
    border-radius: 0.45rem;
    width: 70%;
  }
`;

const VerticalLine = styled.div.attrs({ className: 'shimmerEffect' })`
  display: flex;
  padding-inline: 0.5rem;
  > div {
    width: 2px;
    height: 100%;
  }
`;
