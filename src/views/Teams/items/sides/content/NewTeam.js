import * as Styled from '../../../Teams.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';

const NewTeam = () => {
  const addNewTeam = () => {
    console.log('add new team');
  };

  return (
    <Styled.TeamConatiner isNew onClick={addNewTeam}>
      <Styled.NewTeamWrapper>
        <PlusIcon size={50} color="#BAC9DC" />
        <Styled.NewTeamLabel>ایجاد تیم جدید</Styled.NewTeamLabel>
      </Styled.NewTeamWrapper>
    </Styled.TeamConatiner>
  );
};

export default NewTeam;
