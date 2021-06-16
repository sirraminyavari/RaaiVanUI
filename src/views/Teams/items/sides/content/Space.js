import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import * as Styled from 'views/Teams/Teams.styles';
import ActiveTeam from './TeamActive';
import NewTeam from './NewTeam';
import ArchivedTeams from './ArchivedTeams';
import SpaceHeader from './SpcaeHeader';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { reorder } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const { setApplications } = ApplicationsSlice.actions;

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);

  const SortableItem = SortableElement((props) => {
    const { team, shouldUseDragHandle } = props;
    if (team.ApplicationID === 'archived-apps') {
      return <ArchivedTeams team={team} hasHandle={shouldUseDragHandle} />;
    }

    if (team.ApplicationID === 'add-app') {
      return <NewTeam />;
    }

    return <ActiveTeam team={team} hasHandle={shouldUseDragHandle} />;
  });

  const SortableList = SortableContainer((props) => {
    const { teams, ...restProps } = props;
    return (
      <Styled.TeamListConatiner>
        {!!teams.length ? (
          teams.map((team, index) => {
            return (
              <SortableItem
                key={`item-${team.ApplicationID}`}
                index={index}
                team={team}
                {...restProps}
              />
            );
          })
        ) : (
          <LogoLoader />
        )}

        {/* <NewTeam /> */}
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
