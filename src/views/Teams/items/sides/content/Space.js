import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Teams/Teams.styles';
import SpaceHeader from './SpcaeHeader';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { reorder } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Flipper, Flipped } from 'react-flip-toolkit';
import DragItem from './DragTeam';

const { setApplications } = ApplicationsSlice.actions;

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);

  const moveCard = (dragIndex, hoverIndex) => {
    const reordered = reorder(teams, dragIndex, hoverIndex);
    dispatch(setApplications(reordered));
  };

  let flipId = '';
  teams.forEach((team) => {
    flipId += team.ApplicationID;
  });

  return (
    <Styled.SpaceConatiner>
      <SpaceHeader space={space} />
      <DndProvider backend={HTML5Backend}>
        <Flipper flipKey={flipId} spring="stiff">
          <Styled.TeamListConatiner>
            {teams.length !== 0 ? (
              teams.map((team, index) => {
                return (
                  <Flipped key={team.ApplicationID} flipId={team.ApplicationID}>
                    <DragItem
                      team={team}
                      key={team.ApplicationID}
                      index={index}
                      moveCard={moveCard}
                    />
                  </Flipped>
                );
              })
            ) : (
              <LogoLoader />
            )}
          </Styled.TeamListConatiner>
        </Flipper>
      </DndProvider>
    </Styled.SpaceConatiner>
  );
};

export default WorkSpace;
