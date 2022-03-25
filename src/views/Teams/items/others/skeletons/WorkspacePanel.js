import React from 'react';
import Shimmer from 'components/Shimmer/Shimmer';
import Avatar from 'components/Avatar/Avatar';
import WorkspaceTeamsSkeleton from './WorkspaceTeams';
import styled from 'styled-components';

const WorkspacePanelSkeleton = (props) => {
  const emptyImage =
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  return (
    <>
      <WorkspacePanelHeaderSkeleton>
        <Avatar
          className="shimmerEffect Avatar"
          userImage={emptyImage}
          radius={30}
        />
        <div className="headerTextContainer shimmerEffect">
          <span className="text short" />
        </div>
      </WorkspacePanelHeaderSkeleton>
      <WorkspaceTeamsSkeleton />
    </>
  );
};

export default WorkspacePanelSkeleton;

const WorkspacePanelHeaderSkeleton = styled(Shimmer)`
  padding: 0.5rem;
  margin: 0.5rem;
  display: flex;
  width: 100%;
  align-items: center;
  .Avatar {
    display: contents;
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
    &.long {
      width: 100%;
    }
    &.short {
      width: 70%;
    }
  }
`;
