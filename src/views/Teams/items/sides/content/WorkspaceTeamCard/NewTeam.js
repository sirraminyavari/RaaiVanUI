import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from './WorkspaceTeamCard.styles';
import * as GlobalStyled from 'views/Teams/Teams.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import CreateModal from 'components/Modal/types/create/CreateModal';
import { createApplication } from 'store/actions/applications/ApplicationsAction';
import useWindow from 'hooks/useWindowContext';
import { useHistory } from 'react-router-dom';
import { ONBOARDING_USER_TEAM_PATH } from 'views/Onboarding/items/others/constants';

const NewTeam = ({ WorkspaceID }) => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [teamName, setTeamName] = useState('');

  const history = useHistory();
  const dispatch = useDispatch();
  const { RV_RevFloat, RV_Float, RVDic } = useWindow();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  //! Show add new team modal.
  const handleAddTeam = () => {
    // setIsModalShown(true);
    history.push(`${ONBOARDING_USER_TEAM_PATH}?workspaceID=${WorkspaceID}`);
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
      dispatch(createApplication(teamName, WorkspaceID, console.log));
      setIsModalShown(false);
    }
  };

  const createNewTeamTitle = RVDic.CreateN.replace(
    '[n]',
    RVDic.NewN.replace('[n]', RVDic.Team)
  );

  const newTeamName = RVDic.NewN.replace('[n]', RVDic.TeamName);

  return (
    <GlobalStyled.TeamContainer
      isNew
      isMobile={isMobileScreen}
      dir={RV_Float}
      revDir={RV_RevFloat}
      onClick={handleAddTeam}
      style={{ cursor: 'pointer' }}
    >
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        inputValue={teamName}
        onCancelCreate={handleCancelCreate}
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
    </GlobalStyled.TeamContainer>
  );
};

export default NewTeam;
