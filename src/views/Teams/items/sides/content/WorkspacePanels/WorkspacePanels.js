import Header from '../WorkspacesHeader/WorkspacesHeader';
import * as Styled from './WorkspacePanel.styles';
import DesktopWorkSpace from './WorkspacePanel';
import { useEffect, useState } from 'react';
import { getWorkspaces } from 'apiHelper/ApiHandlers/RVApi';
import WorkspacePanelSkeleton from 'views/Teams/items/others/skeletons/WorkspacePanel';

const WorkspacePanels = () => {
  const [Workspaces, setWorkspaces] = useState(undefined);
  useEffect(() => {
    getWorkspaces().then(({ Workspaces }) => setWorkspaces(Workspaces));
  }, []);
  return (
    <>
      <Header />
      <Styled.SpaceListContainer>
        {Workspaces === undefined && <WorkspacePanelSkeleton />}
        {Workspaces?.map((space, key) => (
          <DesktopWorkSpace key={key} space={space} />
        ))}
      </Styled.SpaceListContainer>
    </>
  );
};

export default WorkspacePanels;
