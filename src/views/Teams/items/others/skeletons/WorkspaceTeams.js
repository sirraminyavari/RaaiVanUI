import React from 'react';
import Shimmer from 'components/Shimmer/Shimmer';
import Avatar from 'components/Avatar/Avatar';
import styled from 'styled-components';
import { CV_WHITE } from 'constant/CssVariables';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceTeamsSkeleton = (props) => {
  const isMobile = DimensionHelper().isMobile;
  const emptyImage =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  return (
    <GridWrapper isMobile={isMobile}>
      {Array.apply(null, Array(isMobile ? 1 : 4)).map(() => (
        <Shimmer>
          <TeamCardSkeleton>
            <Avatar
              className="shimmerEffect Avatar"
              userImage={emptyImage}
              radius={50}
            />
            <div className="textContainer shimmerEffect">
              <span className="text short" />
              <span className="text long" />
            </div>
            <div className="AvatarContainer">
              <Avatar
                className="shimmerEffect Avatar"
                userImage={emptyImage}
                radius={50}
              />
              <Avatar
                className="shimmerEffect Avatar"
                userImage={emptyImage}
                radius={50}
              />
              <Avatar
                className="shimmerEffect Avatar"
                userImage={emptyImage}
                radius={50}
              />
              <Avatar
                className="shimmerEffect Avatar"
                userImage={emptyImage}
                radius={50}
              />
              <Avatar
                className="shimmerEffect Avatar"
                userImage={emptyImage}
                radius={50}
              />
            </div>
          </TeamCardSkeleton>
        </Shimmer>
      ))}
    </GridWrapper>
  );
};

export default WorkspaceTeamsSkeleton;

const GridWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  > div {
    flex-shrink: 0;
    width: ${({ isMobile }) => (isMobile ? 100 : 50)}%;
    box-sizing: border-box;
  }
`;
const TeamCardSkeleton = styled.div`
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  padding: 0.5rem;
  margin: 0.5rem;
  .Avatar {
    display: contents;
  }
  .AvatarContainer {
    display: flex;
    .Avatar {
      img {
        width: 2rem;
        height: 2rem;
      }

      &:not(:first-of-type):not(:last-of-type) img {
        margin-inline-start: -0.5rem;
      }
      &:last-of-type img {
        margin-inline-start: calc(100% - 9rem);
      }
    }
  }
  .textContainer {
    margin-block: 1rem;
  }
  .text {
    height: 0.8rem;
    display: inline-block;
    border-radius: 0.8rem;
    &.long {
      width: 100%;
    }
    &.short {
      width: 70%;
    }
  }
`;
