import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './WorkspacePanel.styles';
import SpaceHeader from './WorkspaceHeader';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { reorder } from 'helpers/helpers';
import NewTeam from '../WorkspaceTeamCard/NewTeam';
import ArchivedTeams from '../ArchivedTeams/WorkspaceArchivedTeams';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flipper, Flipped } from 'react-flip-toolkit';
import DragItem from '../WorkspaceTeamCard/DragTeam';
import { setApplicationsOrder } from 'store/actions/applications/ApplicationsAction';
import WorkspaceTeamsSkeleton from '../../../others/skeletons/WorkspaceTeams';

const { setApplications } = ApplicationsSlice.actions;

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.userApps
);

const selectArchivedApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.userArchivedApps
);

const selectIsFetchingApps = createSelector(
  (state) => state.applications,
  (applications) => applications.isFetching
);

const WorkspacePanel = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);
  const archivedApps = useSelector(selectArchivedApplications);
  const isFetching = useSelector(selectIsFetchingApps);

  const moveCard = (dragIndex, hoverIndex) => {
    const reordered = reorder(teams, dragIndex, hoverIndex);
    dispatch(setApplicationsOrder(reordered));
    dispatch(setApplications(reordered));
  };
  const checkWorkspaceHasArchivedApps = () => {
    const workspaceArchivedApps = archivedApps
      .map((app) => {
        if (app.WorkspaceID === space.WorkspaceID) {
          return app;
        }
        return;
      })
      .filter((app) => app);
    if (workspaceArchivedApps.length > 0) return true;
    else return false;
  };

  return (
    <Styled.SpaceContainer>
      <SpaceHeader space={space} />
      <DndProvider backend={HTML5Backend}>
        <Flipper flipKey={space.WorkspaceID} spring="stiff">
          <Styled.TeamListContainer>
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
