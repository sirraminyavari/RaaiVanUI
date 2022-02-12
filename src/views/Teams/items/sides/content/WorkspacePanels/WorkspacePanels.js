import Header from '../WorkspacesHeader/WorkspacesHeader';
import * as Styled from './WorkspacePanel.styles';
import DesktopWorkSpace from './WorkspacePanel';
import { useEffect, useState } from 'react';
import APIHandler from 'apiHelper/APIHandler';

const apiHandler = new APIHandler('RVAPI', 'GetWorkspaces');

const WorkspacePanels = () => {
  const [Workspaces, setWorkspaces] = useState(undefined);
  useEffect(() => {
    apiHandler.fetch({}, ({ Workspaces }) => setWorkspaces(Workspaces));
  }, []);
  return (
    <>
      <Header />
      <Styled.SpaceListContainer>
        {Workspaces?.map((space, key) => (
          <DesktopWorkSpace key={key} space={space} />
        ))}
      </Styled.SpaceListContainer>
    </>
  );
};

export default WorkspacePanels;
