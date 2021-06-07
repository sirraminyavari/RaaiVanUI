import { useDispatch } from 'react-redux';
import * as Styled from '../../../Teams.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import { useState } from 'react';
import CreateModal from './CreateModal';
import { createApplication } from 'store/actions/applications/ApplicationsAction';
import { useMediaQuery } from 'react-responsive';

const NewTeam = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [teamName, setTeamName] = useState(null);
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const handleAddTeam = () => {
    setIsModalShown(true);
  };

  const handleCancelCreate = () => {
    setIsModalShown(false);
    setTeamName(null);
  };

  const handleInputChange = (e) => {
    const spaceName = e.target.value;
    setTeamName(spaceName);
  };

  const handleTeamCreate = () => {
    if (!!teamName) {
      dispatch(createApplication(teamName, console.log));
      setIsModalShown(false);
    }
  };

  return (
    <Styled.TeamConatiner
      isNew
      isMobile={isMobileScreen}
      onClick={handleAddTeam}
      style={{ cursor: 'pointer' }}>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        onCancleCreate={handleCancelCreate}
        onCreate={handleTeamCreate}
        modalTitle="ایجاد تیم جدید"
        modalWidth="40%"
      />
      <Styled.NewTeamWrapper>
        <PlusIcon size={40} color="#BAC9DC" />
        <Styled.NewTeamLabel>
          <span>ایجاد تیم جدید</span>
        </Styled.NewTeamLabel>
      </Styled.NewTeamWrapper>
    </Styled.TeamConatiner>
  );
};

export default NewTeam;
