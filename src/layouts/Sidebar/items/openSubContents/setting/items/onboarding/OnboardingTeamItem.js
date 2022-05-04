import React from 'react';
import Shimmer from 'components/Shimmer/Shimmer';
import Avatar from 'components/Avatar/Avatar';
import styled from 'styled-components';
import { randomNumber } from 'helpers/helpers';
import classNames from 'classnames';

const OnboardingTeamItem = ({ TypeName, IconURL, isLoading = true }) => {
  const emptyImage =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  return (
    <>
      <WorkspacePanelHeaderSkeleton>
        <Avatar
          className={classNames(isLoading && 'shimmerEffect', 'Avatar')}
          userImage={!isLoading ? IconURL : emptyImage}
          radius={30}
        />
        <div
          className={classNames(
            'headerTextContainer',
            isLoading && 'shimmerEffect'
          )}
        >
          {isLoading ? (
            <span className="text short" />
          ) : (
            <span>{TypeName}</span>
          )}
        </div>
      </WorkspacePanelHeaderSkeleton>
    </>
  );
};

export default OnboardingTeamItem;

const WorkspacePanelHeaderSkeleton = styled(Shimmer)`
  padding: 0.5rem;
  margin: 0.5rem;
  display: flex;
  width: 100%;
  align-items: center;
  .Avatar {
    display: contents;
    & > * {
      background: linear-gradient(
        to right,
        #eff1f3 4%,
        #9d9d9d 25%,
        #eff1f3 36%
      );
    }
  }
  .headerTextContainer {
    height: 0.8rem;
    width: 10rem;
    margin-inline-start: 1rem;
  }
  .text {
    height: 0.8rem;
    display: inline-block;
    border-radius: 0.8rem;
    width: ${randomNumber(35, 95)}%;
    background: linear-gradient(to right, #eff1f3 4%, #9d9d9d 25%, #eff1f3 36%);
  }
`;
