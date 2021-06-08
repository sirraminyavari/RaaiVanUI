import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as Styled from 'views/Teams/Teams.styles';
import ActiveTeam from './TeamActive';
import NewTeam from './NewTeam';
import SpaceHeader from './SpcaeHeader';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { reorder } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';

const { setApplications } = ApplicationsSlice.actions;

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);
  const { RVGlobal } = useWindow();
  const { IsSystemAdmin } = RVGlobal;

  const SortableItem = SortableElement((props) => {
    const { team, shouldUseDragHandle } = props;
    return <ActiveTeam team={team} hasHandle={shouldUseDragHandle} />;
  });

  const SortableList = SortableContainer((props) => {
    const { teams, ...restProps } = props;
    return (
      <Styled.TeamListConatiner>
        {teams.map((team, index) => (
          <SortableItem
            key={`item-${team.ApplicationID}`}
            index={index}
            team={team}
            {...restProps}
          />
        ))}
        {IsSystemAdmin && <NewTeam />}
      </Styled.TeamListConatiner>
    );
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const reorderedTeams = reorder(teams, oldIndex, newIndex);

    dispatch(setApplications(reorderedTeams));
  };

  return (
    <Styled.SpaceConatiner>
      <SpaceHeader space={space} />
      <SortableList
        shouldUseDragHandle={true}
        useDragHandle
        axis="xy"
        teams={teams}
        onSortEnd={onSortEnd}
      />
    </Styled.SpaceConatiner>
  );
};

export default WorkSpace;
