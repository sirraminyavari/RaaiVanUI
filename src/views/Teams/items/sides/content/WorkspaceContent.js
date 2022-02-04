import Header from './ContentHeader';
import * as Styled from 'views/Teams/Teams.styles';
import DesktopWorkSpace from './DesktopSpace';
import { useEffect, useState } from 'react';
import APIHandler from 'apiHelper/APIHandler';

const apiHandler = new APIHandler('RVAPI', 'GetWorkspaces');

const DesktopContentSide = () => {
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

export default DesktopContentSide;
