import { useContext } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from '../../../Teams.styles';
import ActiveTeam from './TeamActive';
import InactiveTeam from './TeamInactive';
import NewTeam from './NewTeam';
import SpaceHeader from './SpcaeHeader';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const teams = useSelector(selectApplications);
  const { RVGlobal } = useContext(WindowContext);
  const { IsSystemAdmin } = RVGlobal;

  return (
    <Styled.SpaceConatiner>
      <SpaceHeader space={space} />
      <Styled.TeamListConatiner>
        {teams.map((team, key) => {
          if (key === 0) {
            return <InactiveTeam key={key} team={team} />;
          }
          return <ActiveTeam key={key} team={team} />;
        })}
        {IsSystemAdmin && <NewTeam />}
      </Styled.TeamListConatiner>
    </Styled.SpaceConatiner>
  );
};

export default WorkSpace;
