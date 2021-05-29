import * as Styled from '../../../Teams.styles';
import Team from './Team';
import NewTeam from './NewTeam';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';

const Space = ({ space }) => {
  return (
    <Styled.SpaceConatiner>
      <Styled.SpaceHeader>
        <div style={{ color: '#2B2727', fontSize: '1rem', fontWeight: 'bold' }}>
          {space.title}
        </div>
        {space.role === 'admin' && (
          <div
            style={{
              width: '3rem',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TrashIcon color="#BAC9DC" />
            <SettingIcon color="#BAC9DC" />
          </div>
        )}
      </Styled.SpaceHeader>
      <Styled.TeamListConatiner>
        {space.teams.map((team) => {
          return <Team team={team} />;
        })}
        <NewTeam />
      </Styled.TeamListConatiner>
    </Styled.SpaceConatiner>
  );
};

export default Space;
