import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from 'views/Teams/Teams.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import CreateModal from 'components/Modal/types/create/CreateModal';
import { createApplication } from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';

const NewTeam = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [teamName, setTeamName] = useState('');
  const dispatch = useDispatch();
  const { RV_RevFloat, RV_Float, RVDic } = useWindow();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  //! Show add new team modal.
  const handleAddTeam = () => {
    setIsModalShown(true);
  };

  //! Close modal and cancel add team proccess.
  const handleCancelCreate = () => {
    setIsModalShown(false);
    setTeamName('');
  };

  const handleInputChange = (inputValue) => {
    setTeamName(inputValue);
  };

  //! Add team and call api.
  const handleTeamCreate = () => {
    if (!!teamName) {
      dispatch(createApplication(teamName, console.log));
      setIsModalShown(false);
    }
  };

  const createNewTeamTitle = RVDic.CreateN.replace(
    '[n]',
    RVDic.NewN.replace('[n]', RVDic.Team)
  );

  const newTeamName = RVDic.NewN.replace('[n]', RVDic.TeamName);

  return (
    <Styled.TeamConatiner
      isNew
      isMobile={isMobileScreen}
      dir={RV_Float}
      revDir={RV_RevFloat}
      onClick={handleAddTeam}
      style={{ cursor: 'pointer' }}>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        inputValue={teamName}
        onCancleCreate={handleCancelCreate}
        onCreate={handleTeamCreate}
        modalTitle={createNewTeamTitle}
        modalWidth="35%"
        placeholder={newTeamName}
      />
      <Styled.NewTeamWrapper>
        <PlusIcon size={40} />
        <Styled.NewTeamLabel>
          <span>{createNewTeamTitle}</span>
        </Styled.NewTeamLabel>
      </Styled.NewTeamWrapper>
    </Styled.TeamConatiner>
  );
};

export default NewTeam;
