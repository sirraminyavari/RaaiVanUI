import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Teams/Teams.styles';
import SpaceHeader from './SpaceHeader';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { reorder } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import NewTeam from './NewTeam';
import ArchivedTeams from './ArchivedTeams';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flipper, Flipped } from 'react-flip-toolkit';
import DragItem from './DragTeam';
import { setApplicationsOrder } from 'store/actions/applications/ApplicationsAction';

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

const DesktopWorkSpace = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);
  const archivedApps = useSelector(selectArchivedApplications);
  const isFetching = useSelector(selectIsFetchingApps);

  const moveCard = (dragIndex, hoverIndex) => {
    const reordered = reorder(teams, dragIndex, hoverIndex);
    dispatch(setApplicationsOrder(reordered));
    dispatch(setApplications(reordered));
  };

  return (
    <Styled.SpaceConatiner>
      <SpaceHeader space={space} />
      <DndProvider backend={HTML5Backend}>
        <Flipper flipKey={space.id} spring="stiff">
          <Styled.TeamListConatiner>
            {isFetching ? (
              <LogoLoader />
            ) : (
              <>
                {teams?.map((team, index) => {
                  return (
                    <Flipped
                      key={team?.ApplicationID}
                      flipId={team?.ApplicationID}>
                      <DragItem
                        team={team}
                        key={team?.ApplicationID}
                        index={index}
                        moveCard={moveCard}
                      />
                    </Flipped>
                  );
                })}
                {!!archivedApps.length && (
                  <ArchivedTeams archives={archivedApps} />
                )}
                <NewTeam />
              </>
            )}
          </Styled.TeamListConatiner>
        </Flipper>
      </DndProvider>
    </Styled.SpaceConatiner>
  );
};

export default DesktopWorkSpace;
