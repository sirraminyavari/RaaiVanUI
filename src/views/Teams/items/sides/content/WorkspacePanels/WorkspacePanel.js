import { useSelector, useDispatch } from 'react-redux';
import * as Styled from './WorkspacePanel.styles';
import SpaceHeader from './WorkspaceHeader';
import { reorder } from 'helpers/helpers';
import NewTeam from '../WorkspaceTeamCard/NewTeam';
import ArchivedTeams from '../ArchivedTeams/WorkspaceArchivedTeams';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flipper, Flipped } from 'react-flip-toolkit';
import DragItem from '../WorkspaceTeamCard/DragTeam';
import WorkspaceTeamsSkeleton from '../../../others/skeletons/WorkspaceTeams';
import { useApplicationSlice } from 'store/slice/applications';
import API from 'apiHelper';
import { selectApplication } from 'store/slice/applications/selectors';
import { RVColorProp } from '@cliqmind/rv-components';

const WorkspacePanel = ({ space }) => {
  const dispatch = useDispatch();

  const {
    userApps: teams,
    userArchivedApps: archivedApps,
    isFetching,
  } = useSelector(selectApplication);

  const { actions: applicationActions } = useApplicationSlice();

  const moveCard = async (dragIndex, hoverIndex) => {
    const reordered = reorder(teams, dragIndex, hoverIndex);
    await API.RV.setApplicationsOrder({ ApplicationIDs: reordered });
    dispatch(applicationActions.setApplications(reordered));
  };
  const checkWorkspaceHasArchivedApps = () => {
    const workspaceArchivedApps = archivedApps
      .map((app) => {
        if (app.WorkspaceID === space.WorkspaceID) {
          return app;
        }
        return null;
      })
      .filter((app) => !!app);
    if (workspaceArchivedApps.length > 0) return true;
    else return false;
  };

  return (
    <Styled.SpaceContainer>
      <SpaceHeader space={space} />
      <DndProvider backend={HTML5Backend}>
        <Flipper flipKey={space.WorkspaceID} spring="stiff">
          <Styled.TeamListContainer className={RVColorProp.cgBlue}>
            {isFetching ? (
              <WorkspaceTeamsSkeleton />
            ) : (
              <>
                {teams
                  ?.filter((team) => team.WorkspaceID === space.WorkspaceID)
                  .map((team, index) => (
                    <Flipped
                      key={team?.ApplicationID}
                      flipId={team?.ApplicationID}
                    >
                      <DragItem
                        team={team}
                        key={team?.ApplicationID}
                        index={index}
                        moveCard={moveCard}
                      />
                    </Flipped>
                  ))}
                {(space.Editable || space.Removable) && (
                  <>
                    {checkWorkspaceHasArchivedApps() && (
                      <ArchivedTeams space={space} archives={archivedApps} />
                    )}
                    <NewTeam WorkspaceID={space.WorkspaceID} />
                  </>
                )}
              </>
            )}
          </Styled.TeamListContainer>
        </Flipper>
      </DndProvider>
    </Styled.SpaceContainer>
  );
};

export default WorkspacePanel;
