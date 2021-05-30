import { useSelector } from 'react-redux';
import * as Styled from '../../../Teams.styles';
import Team from './Team';
import NewTeam from './NewTeam';
import SpaceHeader from './SpcaeHeader';
import { createSelector } from 'reselect';

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const teams = useSelector(selectApplications);

  return (
    <Styled.SpaceConatiner>
      <SpaceHeader space={space} />
      <Styled.TeamListConatiner>
        {teams.map((team) => {
          return <Team team={team} />;
        })}
        {space.role === 'admin' && <NewTeam />}
      </Styled.TeamListConatiner>
    </Styled.SpaceConatiner>
  );
};

export default WorkSpace;
